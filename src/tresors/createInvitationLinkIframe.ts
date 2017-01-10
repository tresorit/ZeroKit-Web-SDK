/**
 * @module Tresors
 * @internal
 */
/** typedoc workaround */
import * as Promise from "core-js/library/es6/promise";

import { InputIframe } from "../iframes/inputIframe";
import {PasswordMetrics} from "../utils/passwordMetrics";
import {CreateLinkResponse} from "./createLinkResponse";
import {rejection} from "../utils/rejection";

export class CreateInvitationLinkIframe extends InputIframe {
  /**
   * Creates an invitation link with the password entered into the iframe
   * @param linkBase The start of the link. The secret will be added to the end of this string after a #
   * @param tresorId The id of the tresor the invitee will be added to after accepting
   * @param {string?} message Optional additional data that can be retrieved with getInvitationLinkInfo
   * @return {Promise<CreateLinkResponse>} The url is the actual link created that will be enabled after operation is approved by the returned id
   */
  createInvitationLink(linkBase: string, tresorId: string, message: string): Promise<CreateLinkResponse> {
    if (!tresorId)
      return rejection("BadInput", "tresorId cannot be empty");
    return this.apiCall("createInvitationLink", [linkBase, tresorId, message]);
  }

  /**
   * Checks if the passwords match in the password and the confirmation inputs
   * @return {Promise<boolean>} Indicates if the passwords match
   */
  checkPasswordsMatch(): Promise<boolean> {
    return this.apiCall("checkPasswordMatch", []);
  }

  /**
   * Returns some information on the strength of the password calculated by zxcvbn
   * @return {Promise<PasswordMetrics>} Password metadata
   */
  getPasswordStrength(): Promise<PasswordMetrics> {
    return this.apiCall("getPasswordStrength", []);
  }
}
