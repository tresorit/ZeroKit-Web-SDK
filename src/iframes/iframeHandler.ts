import * as Map from "core-js/library/es6/map";
import * as Promise from "core-js/library/es6/promise";

import { Deferred } from "../utils/deferred";

/**
 * This class is a base class of all iframe wrappers, handling communication with wrapped iframes and transforming calls to Promises
 */
export class IframeHandler {
  /**
   * The origin of the iframe to handle. Used to check if the iframe was redirected.
   */
  protected embeddedApiOrigin: string;
  /**
   * The embedded iframe
   */
  private iframe: HTMLIFrameElement;
  /**
   * A map of callbacks to be called on certain event types
   */
  private eventCallbacks: Map<string, ((target: string) => void)[]>;
  /**
   * A list of pending calls/promises
   */
  private pending: Map<number, Deferred>;
  /**
   * The call id counter. This id is used to match responses to calls
   */
  private idCounter: number;
  /**
   * A promise that resolves when the iframe is properly loaded. We wait for this before any calls.
   */
  private loadPromise: Promise<string>;

  /**
   * A promise that resolves if the handler successfully subscribed to the events inside the iframe
   */
  private eventSubscribePromise: Promise<null>;

  constructor(embeddedApiOrigin: string, iframe: HTMLIFrameElement) {
    this.embeddedApiOrigin = embeddedApiOrigin;
    this.iframe = iframe;

    this.eventCallbacks = new Map<string, ((target: string) => void)[]>();
    this.pending = new Map<number, Deferred>();
    this.idCounter = 0;

    this.loadPromise = new Promise((res, rej) => {
      this.iframe.onload = () => {
        try {
          this.iframe.addEventListener("message", this.handleResponse);
          res();
        } catch (ex) {
          rej(ex);
        }
      };
      this.iframe.onerror = () => {
        rej();
      };
    });
  }

  /**
   * This handles messages to the current window, filtering for ones coming from the iframe
   * @param event The message to be handled
   */
  private handleResponse(event: MessageEvent) {
    if (event.source === this.iframe.contentWindow) {
      if (event.origin !== this.embeddedApiOrigin) {
        throw new Error("iframe source mismatch at response");
      }

      const data = event.data;

      if (data.type === "event") {
        if (this.eventCallbacks.has(data.value.type))
          this.eventCallbacks.get(data.value.type).forEach((f) => f(data.value));
      } else {
        const deferred = this.pending.get(data.id);

        if (!deferred)
          throw new Error("Unexpected response: " + data.cmd);

        switch (data.type) {
          case "resolve":
            deferred.resolve(data.value);
            this.pending.delete(data.id);
            break;
          case "reject":
            deferred.reject(data.value); // TODO: make it typed
            this.pending.delete(data.id);
            break;
        }
      }
    }
  };

  /**
   * Call a remote method on the iframe. Always returns a promise
   * @param cmd The name of the remote method
   * @param args The arguments to be sent
   * @param iframeIdProm Some special calls that need to read inputs on other iframes require an iframe id.
   * @return {Promise<any>} Resolves or rejects based on the result of the method inside the iframe
   */
  call(cmd: string, args: any[] = [], iframeIdProm?: Promise<string>): Promise<any> {
    const id = ++this.idCounter;
    const deferred = new Deferred();
    this.pending.set(id, deferred);
    Promise.all([iframeIdProm, this.loadPromise]).then(([iframeId]) => {
      this.iframe.contentWindow.postMessage({cmd, args, id, iframeId: iframeId}, this.embeddedApiOrigin);
    });
    return deferred.promise;
  };

  /**
   * Registers a callback to call on an event of the given type
   * @param type The type of event that should call the callback function
   * @param callback The callback function to call
   * @return {Promise<null>} Resolves when the subscription was successful
   */
  onEvent(type: string, callback: (target: string) => void): Promise<null> {
    if (!this.eventSubscribePromise)
      this.eventSubscribePromise = this.call("subscribe");

    if (!this.eventCallbacks.has(type))
      this.eventCallbacks.set(type, <((target: string) => void)[]>[]);

    this.eventCallbacks.get(type).push(callback);

    return this.eventSubscribePromise;
  };
}
