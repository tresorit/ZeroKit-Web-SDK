import { LoginIframe } from "../users/loginIframe";
import { RegisterIframe } from "../users/registerIframe";
import { AcceptInvitationLinkIframe } from "../tresors/acceptInvitationLinkIframe";
import { CreateInvitationLinkIframe } from "../tresors/createInvitationLinkIframe";
import { ChangePasswordIframe } from "../users/changePasswordIframe";
import { IframeHandler } from "./iframeHandler";
import { SDK_VERSION } from "../config";
import { PathData } from "../utils/pathData";

/**
 * Stores the path/urls of the sdk
 */
let paths: PathData;

/**
 * The handler of the main iframe
 */
let apiHandler: IframeHandler = null;

/**
 * Adds an iframe to the page and returns the HTMLIFrameElement
 * @param url The url of the iframe
 * @param parentElement The parent element of the iframe to be added. Defaults to body
 * @param hidden If true applies display = none to the iframe
 * @return {HTMLIFrameElement}
 */
function createIframe(url: string, parentElement: HTMLElement = document.body, hidden: boolean = true): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.src = url;
  if (hidden)
    iframe.style.display = "none";

  parentElement.appendChild(iframe);

  return iframe;
}

/**
 * Sets up the sdk, calculating the necessary paths
 * @param origin The origin of the sdk
 * @param tenantPath The path of your tenant on the tenant host
 */
export function setup(origin: string, tenantPath: string = ""): void {
  if (paths)
    throw new Error("setup called twice");
  const iframeRoot = `${origin}${tenantPath}/static/v${SDK_VERSION}`;
  paths = {
    origin,
    path: `${iframeRoot}/api.html`,
    loginPath: `${iframeRoot}/embedded-login.html`,
    registerPath: `${iframeRoot}/embedded-register.html`,
    acceptInvitationLinkPath: `${iframeRoot}/embedded-acceptInvitationLink.html`,
    createInvitationLinkPath: `${iframeRoot}/embedded-createInvitationLink.html`,
    changePasswordPath: `${iframeRoot}/embedded-changePassword.html`,
    authPath: `${tenantPath}/static/auth.html`
  };
}

/**
 * Checks if the sdk was configured before, throws if not.
 * @private
 */
function checkSetup(): void {
  if (!paths) throw new Error("setup must be called before usage.");
}

/**
 * Returns/sets up the wrapper of the main api iframe
 * @private
 * @return {IframeHandler}
 */
export function getApiHandler(): IframeHandler {
  checkSetup();

  return apiHandler || (apiHandler  = new IframeHandler(paths.origin, createIframe(paths.path)));
}

/* Iframe management */
/**
 * Loads and wraps a LoginIframe, returning the wrapped object
 * @param parentElement The element that the iframe will be added to
 * @return {LoginIframe}
 */
export function getLoginIframe(parentElement: HTMLElement): LoginIframe {
  checkSetup();

  return wrapLoginIframe(createIframe(paths.loginPath, parentElement, false));
}

/**
 * Wraps the iframe as a LoginIframe
 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-login.html"
 * @param iframe The iframe to be wrapped
 * @return {LoginIframe}
 */
export function wrapLoginIframe(iframe: HTMLIFrameElement): LoginIframe {
  checkSetup();

  return new LoginIframe(paths, getApiHandler(), iframe);
}

/**
 * Loads and wraps a RegistrationIframe.
 * @param parentElement The element that the iframe will be added to
 * @return {RegisterIframe}
 */
export function getRegistrationIframe(parentElement: HTMLElement): RegisterIframe {
  checkSetup();

  return wrapRegistrationIframe(createIframe(paths.registerPath, parentElement, false));
}

/**
 * Wraps the iframe as a RegistrationIframe
 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-register.html"
 * @param iframe
 * @return {RegisterIframe}
 */
export function wrapRegistrationIframe(iframe: HTMLIFrameElement): RegisterIframe {
  checkSetup();

  return new RegisterIframe(paths.origin, getApiHandler(), iframe);
}

/**
 * Wraps and load a CreateInvitationLinkIframe
 * @param parentElement The element that the iframe will be added to
 * @return {CreateInvitationLinkIframe}
 */
export function getCreateInvitationLinkPasswordIframe(parentElement: HTMLElement): CreateInvitationLinkIframe {
  checkSetup();

  return wrapCreateInvitationLinkPasswordIframe(createIframe(paths.createInvitationLinkPath, parentElement, false));
}

/**
 * Wraps the given iframe as a CreateInvitationLinkIframe
 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-createInvitationLink.html"
 * @return {CreateInvitationLinkIframe}
 */
export function wrapCreateInvitationLinkPasswordIframe(iframe: HTMLIFrameElement): CreateInvitationLinkIframe {
  checkSetup();

  return new CreateInvitationLinkIframe(paths.origin, getApiHandler(), iframe);
}

/**
 * Loads and wraps an AcceptInvitationLinkPasswordIframe
 * @param parentElement The element that the iframe will be added to
 * @return {AcceptInvitationLinkIframe}
 */
export function getAcceptInvitationLinkPasswordIframe(parentElement: HTMLElement): AcceptInvitationLinkIframe {
  checkSetup();

  return wrapAcceptInvitationLinkPasswordIframe(createIframe(paths.acceptInvitationLinkPath, parentElement, false));
}

/**
 * Wraps the given element as AcceptInvitationLinkPasswordIframe
 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-acceptInvitationLink.html"
 * @return {AcceptInvitationLinkIframe}
 */
export function wrapAcceptInvitationLinkPasswordIframe(iframe: HTMLIFrameElement): AcceptInvitationLinkIframe {
  checkSetup();

  return new AcceptInvitationLinkIframe(paths.origin, getApiHandler(), iframe);
}

/**
 * Loads and wraps a ChangePasswordIframe
 * @param parentElement The element that the iframe will be added to
 * @return {ChangePasswordIframe}
 */
export function getChangePasswordIframe(parentElement: HTMLElement): ChangePasswordIframe {
  checkSetup();

  return wrapChangePasswordIframe(createIframe(paths.changePasswordPath, parentElement, false));
}

/**
 * Wraps the given element as a ChangePasswordIframe
 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-changePassword.html"
 * @return {ChangePasswordIframe}
 */
export function wrapChangePasswordIframe(iframe: HTMLIFrameElement): ChangePasswordIframe {
  checkSetup();

  return new ChangePasswordIframe(paths.origin, getApiHandler(), iframe);
}
