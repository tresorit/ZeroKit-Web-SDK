import { getApiHandler } from "../iframes/iframes";

/**
 * Returns the currently logged in user
 * @return {Promise<string | null>} The id of the current user, or null if there is no logged in user
 */
export function whoAmI() {
  return getApiHandler().call("whoAmI", []);
}

/**
 * Logs the current user out from the zkit. Important to note, that this doesn't clear the idp state.
 * @return {Promise} Resolves on success.
 */
export function logout() {
  return getApiHandler().call("logout", []);
}
