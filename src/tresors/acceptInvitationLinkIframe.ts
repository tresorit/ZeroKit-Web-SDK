import * as Promise from "core-js/library/es6/promise";

import { rejection} from "../utils/rejection";
import { InputIframe } from "../iframes/inputIframe";

/**
 * This wraps an iframe that can be used to have the user enter the password to an invitation link to accept it
 */
export class AcceptInvitationLinkIframe extends InputIframe {
  /**
   * This method tries to accept the invitation link represented by the token unlocked by the password entered by the user into this iframe
   * @param token A token yout get as the $token member returned by the getInvitationLinkInfo method, representing an invitation link
   * @return {Promise<string>} The operation id that has to be approved to actually add the member to the tresor
   */
  acceptInvitationLink(token: any): Promise<string> {
    if (!token)
      return rejection("BadInput", "token cannot be empty");
    return this.apiCall("acceptInvitationLink", [token]);
  }
}
