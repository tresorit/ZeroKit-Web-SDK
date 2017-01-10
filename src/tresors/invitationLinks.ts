import * as Promise from "core-js/library/es6/promise";

import { getApiHandler } from "../iframes/iframes";
import { rejection } from "../utils/rejection";
import { CreateLinkResponse } from "./createLinkResponse";
import {InvitationLinkPublicInfo} from "./invitationLinkPublicInfo";

/**
 * Creates a link that can be used to gain access to the tresor.
 * @param {string} baseLink The start of the link. The link secret will be appended to this after a #
 * @param {string} tresorId The id of the tresor to share
 * @param {string?} message Optional additional data that can be retrieved with getInvitationLinkInfo
 * @return {Promise<CreateLinkResponse>} The url is the actual link created that will be enabled after operation is approved by the returned id
 */
export function createInvitationLinkNoPassword(baseLink: string, tresorId: string, message: string): Promise<CreateLinkResponse> {
  if (!tresorId)
    return rejection("BadInput", "tresorId cannot be empty");
  return getApiHandler().call("createInvitationLinkNoPassword", [baseLink, tresorId, message]);
}

/**
 * Revokes the link. If approved, the link won't be usable.
 * @param {string} tresorId The id of the tresor the link is for
 * @param {string} secret The secret provided in the link after the #
 * @return {Promise<string>} The operation id that has to be approved before this is effective
 */
export function revokeInvitationLink(tresorId: string, secret: string): Promise<string> {
  if (!tresorId)
    return rejection("BadInput", "tresorId cannot be empty");
  if (!secret)
    return rejection("BadInput", "secret cannot be empty");
  return getApiHandler().call("revokeInvitationLink", [tresorId, secret]);
}

/**
 * Returns information about the link, and the token that can be used along with an optional password to accept the invitation.
 * @param {string} secret The secret provided in the link after the #
 * @return {Promise<InvitationLinkPublicInfo>} Information about the link available without entering a password.
 */
export function getInvitationLinkInfo(secret: string): Promise<InvitationLinkPublicInfo> {
  if (!secret)
    return rejection("BadInput", "secret cannot be empty");
  return getApiHandler().call("getInvitationLinkInfo", [secret]);
}

/**
 * Adds the user to the tresor the link was for, but it will only be effective after the returned operation id is approved.
 * @param {Object} token The token returned by getInvitationLinkInfo
 * @return {Promise<string>} The operation id that has to be approved before this is effective
 */
export function acceptInvitationLinkNoPassword(token: any): Promise<string> {
  if (!token)
    return rejection("BadInput", "token cannot be empty");
  if (token.serverData.IsPasswordProtected)
    return rejection("BadInput", "This link needs a password");
  return getApiHandler().call("acceptInvitationLinkNoPassword", [token]);
}
