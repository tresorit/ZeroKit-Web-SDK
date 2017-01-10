export interface CreateLinkResponse {
  /**
   * The url of the invitation link created. This can be used to get access to the tresor the link was created for
   */
  url: string;

  /**
   * Id the operation id of the link creation, this needs to be approved before the above url is actually usable
   */
  id: string;
}
