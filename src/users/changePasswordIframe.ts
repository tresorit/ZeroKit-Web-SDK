import * as Promise from "core-js/library/es6/promise";

import { InputIframe } from "../iframes/inputIframe";
import {PasswordMetrics} from "../utils/passwordMetrics";

export class ChangePasswordIframe extends InputIframe {
  /**
   * Changes the password of the user
   * @param userId The id of the user
   * @return {Promise<string>} The id of the user
   */
  changePassword(userId: string = null): Promise<string> {
    return this.apiCall("changePassword", [userId]);
  }

  /**
   * Checks if the passwords match in the password and the confirmation inputs
   * @return {Promise<boolean>}
   */
  checkPasswordsMatch(): Promise<boolean> {
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
