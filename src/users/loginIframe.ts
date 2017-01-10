import * as Promise from "core-js/library/es6/promise";

import { InputIframe } from "../iframes/inputIframe";
import { IframeHandler } from "../iframes/iframeHandler";
import { PathData } from "../utils/pathData";

/**
 * This interface is needed because the project can't include the full es6 promises
 */
export interface Thenable { // This stub is sufficient for our purposes
  then: (res: (r: any) => any, rej: (r: any) => any) => Thenable;
}

/**
 * Callback passed in by the user
 */
export type LoginCallback = (userId: string, willRedirect: boolean) => (Thenable|any);

/**
 * The response of the login call
 */
export type LoginResponse = {needsRedirect: boolean, userId: string};

/**
 * Handles the results of the login call, calling the callback and redirecting if necessary
 * @param callback User provided callback
 * @param loginResponse The response of the login api call
 * @param reTo Url to redirect to if the login is part of an IDP login process
 * @return {Promise<string>} Resolves to the userId if there was no redirection
 */
function handleResult(callback: LoginCallback, loginResponse: LoginResponse, reTo: string): Promise<string> {
  if (loginResponse.needsRedirect) {
    if (callback) {
      const cbRes = callback(loginResponse.userId, loginResponse.needsRedirect);
      if (cbRes.then)
        return cbRes.then(() => window.location.assign(reTo), () => window.location.assign(reTo));
      else
        window.location.assign(reTo);
    } else {
      window.location.assign(reTo);
    }

    // We should never get here because of the redirection above
    return new Promise<string>(() => {}); // Intentionally never resolve
  } else {
    if (callback) {
      const cbRes = callback(loginResponse.userId, loginResponse.needsRedirect);
      if (cbRes.then)
        return cbRes.then(() => loginResponse.userId);
    }
    return Promise.resolve(loginResponse.userId);
  }
}

export class LoginIframe extends InputIframe {
  /**
   * Url indicating where we must redirect to if this is part of an IDP login process
   */
  private authPath: string;

  constructor(embedded_data: PathData, api: IframeHandler, iframe: HTMLIFrameElement) {
    super(embedded_data.origin, api, iframe);

    this.authPath = embedded_data.authPath;
  }

  /**
   * Logs in the user with the password entered in the iframe and the userId provided
   * If the login was part of an IDP login process the returned promise never resolves
   * @param userId The id of the user trying to log in
   * @param callback An optional callback to call after a successful login, regardless of redirection.
   * @return {Promise<string>} Resolves to the userId if there was no redirection
   */
  login(userId: string, callback: LoginCallback = null): Promise<string> {
    return this.apiCall("login", [userId])
      .then(r => handleResult(callback, r, this.embeddedApiOrigin + this.authPath));
  }
}
