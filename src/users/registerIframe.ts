import * as Promise from "core-js/library/es6/promise";

import { InputIframe } from "../iframes/inputIframe";
import {PasswordMetrics} from "../utils/passwordMetrics";
import {rejection} from "../utils/rejection";

export interface RegistrationResponse {
  RegValidationVerifier: string;
}

export class RegisterIframe extends InputIframe {
  /**
   *  Registers a user with the password entered inside the iframe with the userId provided
   * @param userId UserId to register the current user with
   * @param regId Registration session id
   * @return {Promise<RegistrationResponse>} The contained validation verifier can be used to validate the user.
   */
  register(userId: string, regId: string): Promise<RegistrationResponse> {
    if (!userId || !regId)
      return rejection("BadInput", "userId and regId cannot be empty");
    return this.apiCall("register", [userId, regId]);
  }

  /**
   * Tries to log in the user with the password entered into the iframe with the id provided.
   * This method can be used to log the user in right after registration, but it has to be noted,
   * that the user has to be validated before that is possible.
   * @param userId The id of the user logging in
   * @return {Promise<string>} Resolves to the id of logged in user
   */
  login(userId: string): Promise<string> {
    return this.apiCall("login", [userId]).then(r => r.userId);
  }

  /**
   * Checks if the passwords match in the password and the confirmation inputs
   * @return {Promise<boolean>}
   */
  checkPasswordMatch(): Promise<boolean> {
    return this.apiCall("checkPasswordMatch", []);
  }

  /**
   * Returns some information on the strength of the password calculated by zxcvbn
   * @return {Promise<PasswordMetrics>}
   */
  getPasswordStrength(): Promise<PasswordMetrics> {
    return this.apiCall("getPasswordStrength", []);
  }
}
