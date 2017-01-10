import * as Promise from "core-js/library/es6/promise";

import { IframeHandler } from "./iframeHandler";

/**
 * An input iframes handles inputs and doesn't actually do any heavy lifting. They are all hosted on the same origin as the
 * ApiIframe, so it can read the inputs from there and do the actual calculations.
 */
export class InputIframe extends IframeHandler {
  /**
   * The idPromise resolves to the id of the iframe used to identify which iframe to read the inputs from.
   */
  private idPromise: Promise<string>;

  /**
   * A reference to the api that will actually handle the calculations
   */
  private api: IframeHandler;

  constructor(origin: string, api: IframeHandler, iframe: HTMLIFrameElement) {
    super(origin, iframe);
    this.idPromise = this.call("getId");
    this.api = api;
  }

  /**
   * Gets the classes of the element by the given id
   * @param id The id of the element
   * @return {Promise<string[]>} Resolves to an array of the classes of the element
   */
  getClasses(id: string): Promise<string[]> {
    return this.call("getClasses", [id]);
  }

  /**
   * Adds a class to the element
   * @param id The id of the element
   * @param className The class to add
   * @return {Promise<null>} Resolves when done
   */
  addClass(id: string, className: string): Promise<null> {
    return this.call("addClass", [id, className]);
  }

  /**
   * Removes a class from the element
   * @param id The id of the element
   * @param className The class to remove
   * @return {Promise<null>} Resolves when done
   */
  removeClass(id: string, className: string): Promise<null> {
    return this.call("removeClass", [id, className]);
  }

  /**
   * Sets the placeholder of the element
   * @param id The id of the element
   * @param text The new placeholder text
   * @return {Promise<null>} Resolves when done
   */
  setPlaceholder(id: string, text: string): Promise<null> {
    return this.call("setPlaceholder", [id, text]);
  }

  /**
   * Registers a callback that will be called when the enter key is pressed in the iframe
   * @param callback The callback to call
   * @return {Promise<null>} Resolves after successful subscription
   */
  onEnter(callback: (targetId: string) => void): Promise<null> {
    return this.onEvent("enter", callback);
  }

  /**
   * Registers a callback that will be called when an input gets focus in the iframe
   * @param callback The callback to call
   * @return {Promise<null>} Resolves after successful subscription
   */
  onFocus(callback: (targetId: string) => void): Promise<null> {
    return this.onEvent("focus", callback);
  }

  /**
   * Registers a callback that will be called when an input gets focus in the iframe
   * @param callback The callback to call
   * @return {Promise<null>} Resolves after successful subscription
   */
  onBlur(callback: (targetId: string) => void): Promise<null> {
    return this.onEvent("blur", callback);
  }

  /**
   * Call to the main iframe passing it the id of the iframe handled by this object.
   * This is usually a use input dependent operation that needs to read a password
   * @param method The method to call
   * @param args The arguments to pass
   * @return {Promise<any>} Resolves or rejects based on the result of the remote method
   */
  apiCall(method: string, args: any[]): Promise<any> {
    return this.api.call(method, args, this.idPromise);
  }
}
