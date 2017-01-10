/**
 *  Information available about an invitation link that is returned by getInvitationLinkInfo.
 *  Public in the sense, that anyone who has the link can access it without the password.
 */
export class InvitationLinkPublicInfo {
  /**
   *  The id of the user that created the link
   */
  userId: string;
  /**
   * Indicates if the link is password protected
   */
  isPasswordProtected: boolean;

  /**
   * Optional, arbitrary string data stored encrypted when the link was created
   */
  message: string;

  /**
   * Link information for internal use, used as a parameter for acceptInvitationLink
   */
  $token: any;
}
