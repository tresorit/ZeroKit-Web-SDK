import * as Promise from "core-js/library/es6/promise";

import {getApiHandler} from "../iframes/iframes";
import {rejection} from "../utils/rejection";

/**
 * Create a new tresor. The tresor is only usable after the it is approved.
 * @return {Promise.<string>} The id of the tresor
 */
export function createTresor(): Promise<string> {
  return getApiHandler().call("createTresor", []);
}

/**
 * Share a tresor with a user, effective after the returned id is approved.
 * @param {string} tresorId The id of the tresor
 * @param {string} userId The id of the invitee
 * @return {Promise<string>} The operation id that has to be approved before the invitee can access the tresor
 */
export function shareTresor(tresorId: string, userId: string): Promise<string> {
  if (!tresorId || !userId)
    return rejection("BadInput", "tresorId and userId cannot be empty");
  return getApiHandler().call("shareTresor", [tresorId, userId]);
}

/**
 * Kick a user from a tresor, effective after the returned id is approved.
 * @param {string} tresorId The id of the tresor
 * @param {string} userId The id of the user to kick
 * @return {Promise<string>} The operation id that has to be approved before the kick is effective.
 */
export function kickFromTresor(tresorId: string, userId: string) {
  if (!tresorId || !userId)
    return rejection("BadInput", "tresorId and userId cannot be empty");
  return getApiHandler().call("kickFromTresor", [tresorId, userId]);
}
