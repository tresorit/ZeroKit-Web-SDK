declare module 'zerokit-web-sdk/src/config' {
	/**
	 * The version of the SDK
	 */
	export const SDK_VERSION = "4";

}
declare module 'zerokit-web-sdk/src/utils/deferred' {
	/// <reference types="core-js" />
	/**
	 * This class represents promise that can be resolved or rejected later in a different scope(e.g.: event handler)
	 */
	export class Deferred {
	    /**
	     * Function that resolves the contained promise
	     */
	    resolve: (value: any) => void;
	    /**
	     * Function that rejects the contained promise
	     */
	    reject: (value: any) => void;
	    /**
	     * The contained promise that can be resolved and rejected by calling the respective functions
	     */
	    readonly promise: Promise<any>;
	    private _promise;
	    constructor();
	}

}
declare module 'zerokit-web-sdk/src/iframes/iframeHandler' {
	/// <reference types="core-js" />
	/**
	 * This class is a base class of all iframe wrappers, handling communication with wrapped iframes and transforming calls to Promises
	 */
	export class IframeHandler {
	    /**
	     * The origin of the iframe to handle. Used to check if the iframe was redirected.
	     */
	    protected embeddedApiOrigin: string;
	    /**
	     * The embedded iframe
	     */
	    private iframe;
	    /**
	     * A map of callbacks to be called on certain event types
	     */
	    private eventCallbacks;
	    /**
	     * A list of pending calls/promises
	     */
	    private pending;
	    /**
	     * The call id counter. This id is used to match responses to calls
	     */
	    private idCounter;
	    /**
	     * A promise that resolves when the iframe is properly loaded. We wait for this before any calls.
	     */
	    private loadPromise;
	    /**
	     * A promise that resolves if the handler successfully subscribed to the events inside the iframe
	     */
	    private eventSubscribePromise;
	    constructor(embeddedApiOrigin: string, iframe: HTMLIFrameElement);
	    /**
	     * This handles messages to the current window, filtering for ones coming from the iframe
	     * @param event The message to be handled
	     */
	    private handleResponse(event);
	    /**
	     * Call a remote method on the iframe. Always returns a promise
	     * @param cmd The name of the remote method
	     * @param args The arguments to be sent
	     * @param iframeIdProm Some special calls that need to read inputs on other iframes require an iframe id.
	     * @return {Promise<any>} Resolves or rejects based on the result of the method inside the iframe
	     */
	    call(cmd: string, args?: any[], iframeIdProm?: Promise<string>): Promise<any>;
	    /**
	     * Registers a callback to call on an event of the given type
	     * @param type The type of event that should call the callback function
	     * @param callback The callback function to call
	     * @return {Promise<null>} Resolves when the subscription was successful
	     */
	    onEvent(type: string, callback: (target: string) => void): Promise<null>;
	}

}
declare module 'zerokit-web-sdk/src/iframes/inputIframe' {
	/// <reference types="core-js" />
	import { IframeHandler } from 'zerokit-web-sdk/src/iframes/iframeHandler';
	/**
	 * An input iframes handles inputs and doesn't actually do any heavy lifting. They are all hosted on the same origin as the
	 * ApiIframe, so it can read the inputs from there and do the actual calculations.
	 */
	export class InputIframe extends IframeHandler {
	    /**
	     * The idPromise resolves to the id of the iframe used to identify which iframe to read the inputs from.
	     */
	    private idPromise;
	    /**
	     * A reference to the api that will actually handle the calculations
	     */
	    private api;
	    constructor(origin: string, api: IframeHandler, iframe: HTMLIFrameElement);
	    /**
	     * Gets the classes of the element by the given id
	     * @param id The id of the element
	     * @return {Promise<string[]>} Resolves to an array of the classes of the element
	     */
	    getClasses(id: string): Promise<string[]>;
	    /**
	     * Adds a class to the element
	     * @param id The id of the element
	     * @param className The class to add
	     * @return {Promise<null>} Resolves when done
	     */
	    addClass(id: string, className: string): Promise<null>;
	    /**
	     * Removes a class from the element
	     * @param id The id of the element
	     * @param className The class to remove
	     * @return {Promise<null>} Resolves when done
	     */
	    removeClass(id: string, className: string): Promise<null>;
	    /**
	     * Sets the placeholder of the element
	     * @param id The id of the element
	     * @param text The new placeholder text
	     * @return {Promise<null>} Resolves when done
	     */
	    setPlaceholder(id: string, text: string): Promise<null>;
	    /**
	     * Registers a callback that will be called when the enter key is pressed in the iframe
	     * @param callback The callback to call
	     * @return {Promise<null>} Resolves after successful subscription
	     */
	    onEnter(callback: (targetId: string) => void): Promise<null>;
	    /**
	     * Registers a callback that will be called when an input gets focus in the iframe
	     * @param callback The callback to call
	     * @return {Promise<null>} Resolves after successful subscription
	     */
	    onFocus(callback: (targetId: string) => void): Promise<null>;
	    /**
	     * Registers a callback that will be called when an input gets focus in the iframe
	     * @param callback The callback to call
	     * @return {Promise<null>} Resolves after successful subscription
	     */
	    onBlur(callback: (targetId: string) => void): Promise<null>;
	    /**
	     * Call to the main iframe passing it the id of the iframe handled by this object.
	     * This is usually a use input dependent operation that needs to read a password
	     * @param method The method to call
	     * @param args The arguments to pass
	     * @return {Promise<any>} Resolves or rejects based on the result of the remote method
	     */
	    apiCall(method: string, args: any[]): Promise<any>;
	}

}
declare module 'zerokit-web-sdk/src/utils/pathData' {
	export interface PathData {
	    origin: string;
	    path: string;
	    loginPath: string;
	    registerPath: string;
	    acceptInvitationLinkPath: string;
	    createInvitationLinkPath: string;
	    changePasswordPath: string;
	    authPath: string;
	}

}
declare module 'zerokit-web-sdk/src/users/loginIframe' {
	/// <reference types="core-js" />
	import { InputIframe } from 'zerokit-web-sdk/src/iframes/inputIframe';
	import { IframeHandler } from 'zerokit-web-sdk/src/iframes/iframeHandler';
	import { PathData } from 'zerokit-web-sdk/src/utils/pathData';
	/**
	 * This interface is needed because the project can't include the full es6 promises
	 */
	export interface Thenable {
	    then: (res: (r: any) => any, rej: (r: any) => any) => Thenable;
	}
	/**
	 * Callback passed in by the user
	 */
	export type LoginCallback = (userId: string, willRedirect: boolean) => (Thenable | any);
	/**
	 * The response of the login call
	 */
	export type LoginResponse = {
	    needsRedirect: boolean;
	    userId: string;
	};
	export class LoginIframe extends InputIframe {
	    /**
	     * Url indicating where we must redirect to if this is part of an IDP login process
	     */
	    private authPath;
	    constructor(embedded_data: PathData, api: IframeHandler, iframe: HTMLIFrameElement);
	    /**
	     * Logs in the user with the password entered in the iframe and the userId provided
	     * If the login was part of an IDP login process the returned promise never resolves
	     * @param userId The id of the user trying to log in
	     * @param callback An optional callback to call after a successful login, regardless of redirection.
	     * @return {Promise<string>} Resolves to the userId if there was no redirection
	     */
	    login(userId: string, callback?: LoginCallback): Promise<string>;
	}

}
declare module 'zerokit-web-sdk/src/utils/passwordMetrics' {
	export interface PasswordMetrics {
	    /**
	     * 0-4 score of the password calculated by zxcvbn
	     *
	     * 0 # too guessable: risky password. (guesses < 10^3)
	     * 1 # very guessable: protection from throttled online attacks. (guesses < 10^6)
	     * 2 # somewhat guessable: protection from unthrottled online attacks. (guesses < 10^8)
	     * 3 # safely unguessable: moderate protection from offline slow-hash scenario. (guesses < 10^10)
	     * 4 # very unguessable: strong protection from offline slow-hash scenario. (guesses >= 10^10)
	     */
	    score: number;
	    /**
	     * The length of the password
	     */
	    length: number;
	    /**
	     * Feedback provided by zxcvbn on how to improve password strength
	     */
	    feedback: {
	        warning: string;
	        suggestions: string[];
	    };
	    /**
	     * The order of magnitude of the estimated amount of guesses that would be needed to brute-force the password
	     */
	    guesses_log10: number;
	}

}
declare module 'zerokit-web-sdk/src/utils/rejection' {
	/// <reference types="core-js" />
	/**
	 * Returns a rejected Promise<any> with a properly typed error value
	 * @param code Error code
	 * @param description Error description
	 * @return {Promise<any>} The rejected promise
	 */
	export function rejection(code: string, description: string): Promise<any>;

}
declare module 'zerokit-web-sdk/src/users/registerIframe' {
	/// <reference types="core-js" />
	import { InputIframe } from 'zerokit-web-sdk/src/iframes/inputIframe';
	import { PasswordMetrics } from 'zerokit-web-sdk/src/utils/passwordMetrics';
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
	    register(userId: string, regId: string): Promise<RegistrationResponse>;
	    /**
	     * Tries to log in the user with the password entered into the iframe with the id provided.
	     * This method can be used to log the user in right after registration, but it has to be noted,
	     * that the user has to be validated before that is possible.
	     * @param userId The id of the user logging in
	     * @return {Promise<string>} Resolves to the id of logged in user
	     */
	    login(userId: string): Promise<string>;
	    /**
	     * Checks if the passwords match in the password and the confirmation inputs
	     * @return {Promise<boolean>}
	     */
	    checkPasswordMatch(): Promise<boolean>;
	    /**
	     * Returns some information on the strength of the password calculated by zxcvbn
	     * @return {Promise<PasswordMetrics>}
	     */
	    getPasswordStrength(): Promise<PasswordMetrics>;
	}

}
declare module 'zerokit-web-sdk/src/tresors/acceptInvitationLinkIframe' {
	/// <reference types="core-js" />
	import { InputIframe } from 'zerokit-web-sdk/src/iframes/inputIframe';
	/**
	 * This wraps an iframe that can be used to have the user enter the password to an invitation link to accept it
	 */
	export class AcceptInvitationLinkIframe extends InputIframe {
	    /**
	     * This method tries to accept the invitation link represented by the token unlocked by the password entered by the user into this iframe
	     * @param token A token yout get as the $token member returned by the getInvitationLinkInfo method, representing an invitation link
	     * @return {Promise<string>} The operation id that has to be approved to actually add the member to the tresor
	     */
	    acceptInvitationLink(token: any): Promise<string>;
	}

}
declare module 'zerokit-web-sdk/src/tresors/createLinkResponse' {
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

}
declare module 'zerokit-web-sdk/src/tresors/createInvitationLinkIframe' {
	/// <reference types="core-js" />
	import { InputIframe } from 'zerokit-web-sdk/src/iframes/inputIframe';
	import { PasswordMetrics } from 'zerokit-web-sdk/src/utils/passwordMetrics';
	import { CreateLinkResponse } from 'zerokit-web-sdk/src/tresors/createLinkResponse';
	export class CreateInvitationLinkIframe extends InputIframe {
	    /**
	     * Creates an invitation link with the password entered into the iframe
	     * @param linkBase The start of the link. The secret will be added to the end of this string after a #
	     * @param tresorId The id of the tresor the invitee will be added to after accepting
	     * @param {string?} message Optional additional data that can be retrieved with getInvitationLinkInfo
	     * @return {Promise<CreateLinkResponse>} The url is the actual link created that will be enabled after operation is approved by the returned id
	     */
	    createInvitationLink(linkBase: string, tresorId: string, message: string): Promise<CreateLinkResponse>;
	    /**
	     * Checks if the passwords match in the password and the confirmation inputs
	     * @return {Promise<boolean>} Indicates if the passwords match
	     */
	    checkPasswordsMatch(): Promise<boolean>;
	    /**
	     * Returns some information on the strength of the password calculated by zxcvbn
	     * @return {Promise<PasswordMetrics>} Password metadata
	     */
	    getPasswordStrength(): Promise<PasswordMetrics>;
	}

}
declare module 'zerokit-web-sdk/src/users/changePasswordIframe' {
	/// <reference types="core-js" />
	import { InputIframe } from 'zerokit-web-sdk/src/iframes/inputIframe';
	import { PasswordMetrics } from 'zerokit-web-sdk/src/utils/passwordMetrics';
	export class ChangePasswordIframe extends InputIframe {
	    /**
	     * Changes the password of the user
	     * @param userId The id of the user
	     * @return {Promise<string>} The id of the user
	     */
	    changePassword(userId?: string): Promise<string>;
	    /**
	     * Checks if the passwords match in the password and the confirmation inputs
	     * @return {Promise<boolean>}
	     */
	    checkPasswordsMatch(): Promise<boolean>;
	    /**
	     * Returns some information on the strength of the password calculated by zxcvbn
	     * @return {Promise<PasswordMetrics>}
	     */
	    getPasswordStrength(): Promise<PasswordMetrics>;
	}

}
declare module 'zerokit-web-sdk/src/iframes/iframes' {
	import { LoginIframe } from 'zerokit-web-sdk/src/users/loginIframe';
	import { RegisterIframe } from 'zerokit-web-sdk/src/users/registerIframe';
	import { AcceptInvitationLinkIframe } from 'zerokit-web-sdk/src/tresors/acceptInvitationLinkIframe';
	import { CreateInvitationLinkIframe } from 'zerokit-web-sdk/src/tresors/createInvitationLinkIframe';
	import { ChangePasswordIframe } from 'zerokit-web-sdk/src/users/changePasswordIframe';
	import { IframeHandler } from 'zerokit-web-sdk/src/iframes/iframeHandler';
	/**
	 * Sets up the sdk, calculating the necessary paths
	 * @param origin The origin of the sdk
	 * @param tenantPath The path of your tenant on the tenant host
	 */
	export function setup(origin: string, tenantPath?: string): void;
	/**
	 * Returns/sets up the wrapper of the main api iframe
	 * @private
	 * @return {IframeHandler}
	 */
	export function getApiHandler(): IframeHandler;
	/**
	 * Loads and wraps a LoginIframe, returning the wrapped object
	 * @param parentElement The element that the iframe will be added to
	 * @return {LoginIframe}
	 */
	export function getLoginIframe(parentElement: HTMLElement): LoginIframe;
	/**
	 * Wraps the iframe as a LoginIframe
	 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-login.html"
	 * @param iframe The iframe to be wrapped
	 * @return {LoginIframe}
	 */
	export function wrapLoginIframe(iframe: HTMLIFrameElement): LoginIframe;
	/**
	 * Loads and wraps a RegistrationIframe.
	 * @param parentElement The element that the iframe will be added to
	 * @return {RegisterIframe}
	 */
	export function getRegistrationIframe(parentElement: HTMLElement): RegisterIframe;
	/**
	 * Wraps the iframe as a RegistrationIframe
	 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-register.html"
	 * @param iframe
	 * @return {RegisterIframe}
	 */
	export function wrapRegistrationIframe(iframe: HTMLIFrameElement): RegisterIframe;
	/**
	 * Wraps and load a CreateInvitationLinkIframe
	 * @param parentElement The element that the iframe will be added to
	 * @return {CreateInvitationLinkIframe}
	 */
	export function getCreateInvitationLinkPasswordIframe(parentElement: HTMLElement): CreateInvitationLinkIframe;
	/**
	 * Wraps the given iframe as a CreateInvitationLinkIframe
	 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-createInvitationLink.html"
	 * @return {CreateInvitationLinkIframe}
	 */
	export function wrapCreateInvitationLinkPasswordIframe(iframe: HTMLIFrameElement): CreateInvitationLinkIframe;
	/**
	 * Loads and wraps an AcceptInvitationLinkPasswordIframe
	 * @param parentElement The element that the iframe will be added to
	 * @return {AcceptInvitationLinkIframe}
	 */
	export function getAcceptInvitationLinkPasswordIframe(parentElement: HTMLElement): AcceptInvitationLinkIframe;
	/**
	 * Wraps the given element as AcceptInvitationLinkPasswordIframe
	 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-acceptInvitationLink.html"
	 * @return {AcceptInvitationLinkIframe}
	 */
	export function wrapAcceptInvitationLinkPasswordIframe(iframe: HTMLIFrameElement): AcceptInvitationLinkIframe;
	/**
	 * Loads and wraps a ChangePasswordIframe
	 * @param parentElement The element that the iframe will be added to
	 * @return {ChangePasswordIframe}
	 */
	export function getChangePasswordIframe(parentElement: HTMLElement): ChangePasswordIframe;
	/**
	 * Wraps the given element as a ChangePasswordIframe
	 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-changePassword.html"
	 * @return {ChangePasswordIframe}
	 */
	export function wrapChangePasswordIframe(iframe: HTMLIFrameElement): ChangePasswordIframe;

}
declare module 'zerokit-web-sdk/src/encryption/encryption' {
	/// <reference types="core-js" />
	/**
	 * Encrypts the data in the context of the tresor
	 * @param {string} tresorId The id of the tresor to encrypt with
	 * @param {string} plainText The text to encrypt
	 * @return {Promise<string>} Encrypted text, base64 encoded
	 */
	export function encrypt(tresorId: string, plainText: string): Promise<string>;
	/**
	 * Decrypts the data
	 * @param {string} cipherText Encrypted text
	 * @return {Promise<string>} Decrypted text
	 */
	export function decrypt(cipherText: string): Promise<string>;
	/**
	 * Encrypts the data in the context of the tresor
	 * @param {string} tresorId The id of the tresor to encrypt with
	 * @param {Uint8Array} plainBytes The data to encrypt
	 * @return {Promise<Uint8Array>} Encrypted data
	 */
	export function encryptBytes(tresorId: string, plainBytes: Uint8Array): Promise<Uint8Array>;
	/**
	 * Decrypts the data
	 * @param {Uint8Array} cipherText The encrypted data
	 * @return {Promise<Uint8Array>} Decrypted data
	 */
	export function decryptBytes(cipherText: Uint8Array): Promise<Uint8Array>;
	/**
	 * Encrypts the Blob or File in the context of the tresor
	 * @param {string} tresorId The id of the tresor to encrypt the data with
	 * @param {Blob|File} plainBlobLike The data to encrypt
	 * @return {Promise<Blob>} Encrypted Blob
	 */
	export function encryptBlob(tresorId: string, plainBlobLike: Blob | File): Promise<Blob>;
	/**
	 * Decrypts the Blob or File
	 * @param {Blob|File} encryptedBlobLike The data to decrypt
	 * @return {Promise<Blob>} Decrypted Blob
	 */
	export function decryptBlob(encryptedBlobLike: Blob | File): Promise<Blob>;

}
declare module 'zerokit-web-sdk/src/tresors/tresors' {
	/// <reference types="core-js" />
	/**
	 * Create a new tresor. The tresor is only usable after the it is approved.
	 * @return {Promise.<string>} The id of the tresor
	 */
	export function createTresor(): Promise<string>;
	/**
	 * Share a tresor with a user, effective after the returned id is approved.
	 * @param {string} tresorId The id of the tresor
	 * @param {string} userId The id of the invitee
	 * @return {Promise<string>} The operation id that has to be approved before the invitee can access the tresor
	 */
	export function shareTresor(tresorId: string, userId: string): Promise<string>;
	/**
	 * Kick a user from a tresor, effective after the returned id is approved.
	 * @param {string} tresorId The id of the tresor
	 * @param {string} userId The id of the user to kick
	 * @return {Promise<string>} The operation id that has to be approved before the kick is effective.
	 */
	export function kickFromTresor(tresorId: string, userId: string): Promise<any>;

}
declare module 'zerokit-web-sdk/src/tresors/invitationLinkPublicInfo' {
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

}
declare module 'zerokit-web-sdk/src/tresors/invitationLinks' {
	/// <reference types="core-js" />
	import { CreateLinkResponse } from 'zerokit-web-sdk/src/tresors/createLinkResponse';
	import { InvitationLinkPublicInfo } from 'zerokit-web-sdk/src/tresors/invitationLinkPublicInfo';
	/**
	 * Creates a link that can be used to gain access to the tresor.
	 * @param {string} baseLink The start of the link. The link secret will be appended to this after a #
	 * @param {string} tresorId The id of the tresor to share
	 * @param {string?} message Optional additional data that can be retrieved with getInvitationLinkInfo
	 * @return {Promise<CreateLinkResponse>} The url is the actual link created that will be enabled after operation is approved by the returned id
	 */
	export function createInvitationLinkNoPassword(baseLink: string, tresorId: string, message: string): Promise<CreateLinkResponse>;
	/**
	 * Revokes the link. If approved, the link won't be usable.
	 * @param {string} tresorId The id of the tresor the link is for
	 * @param {string} secret The secret provided in the link after the #
	 * @return {Promise<string>} The operation id that has to be approved before this is effective
	 */
	export function revokeInvitationLink(tresorId: string, secret: string): Promise<string>;
	/**
	 * Returns information about the link, and the token that can be used along with an optional password to accept the invitation.
	 * @param {string} secret The secret provided in the link after the #
	 * @return {Promise<InvitationLinkPublicInfo>} Information about the link available without entering a password.
	 */
	export function getInvitationLinkInfo(secret: string): Promise<InvitationLinkPublicInfo>;
	/**
	 * Adds the user to the tresor the link was for, but it will only be effective after the returned operation id is approved.
	 * @param {Object} token The token returned by getInvitationLinkInfo
	 * @return {Promise<string>} The operation id that has to be approved before this is effective
	 */
	export function acceptInvitationLinkNoPassword(token: any): Promise<string>;

}
declare module 'zerokit-web-sdk/src/users/user' {
	/// <reference types="core-js" />
	/**
	 * Returns the currently logged in user
	 * @return {Promise<string | null>} The id of the current user, or null if there is no logged in user
	 */
	export function whoAmI(): Promise<any>;
	/**
	 * Logs the current user out from the zkit. Important to note, that this doesn't clear the idp state.
	 * @return {Promise} Resolves on success.
	 */
	export function logout(): Promise<any>;

}
declare module 'zerokit-web-sdk/src/index' {
	export { getAcceptInvitationLinkPasswordIframe, wrapAcceptInvitationLinkPasswordIframe, getChangePasswordIframe, wrapChangePasswordIframe, getCreateInvitationLinkPasswordIframe, wrapCreateInvitationLinkPasswordIframe, getLoginIframe, wrapLoginIframe, getRegistrationIframe, wrapRegistrationIframe, setup } from 'zerokit-web-sdk/src/iframes/iframes';
	export { createTresor, shareTresor, kickFromTresor } from 'zerokit-web-sdk/src/tresors/tresors';
	export { createInvitationLinkNoPassword, acceptInvitationLinkNoPassword, getInvitationLinkInfo, revokeInvitationLink } from 'zerokit-web-sdk/src/tresors/invitationLinks';
	export { logout, whoAmI } from 'zerokit-web-sdk/src/users/user';
	export { encrypt, encryptBytes, encryptBlob, decrypt, decryptBytes, decryptBlob } from 'zerokit-web-sdk/src/encryption/encryption';

}
declare module 'zerokit-web-sdk' {
	import main = require('zerokit-web-sdk/src/index');
	export = main;
}
declare module 'zerokit-web-sdk/src/config' {
	/**
	 * The version of the SDK
	 */
	export const SDK_VERSION = "4";

}
declare module 'zerokit-web-sdk/src/utils/deferred' {
	/// <reference types="core-js" />
	/**
	 * This class represents promise that can be resolved or rejected later in a different scope(e.g.: event handler)
	 */
	export class Deferred {
	    /**
	     * Function that resolves the contained promise
	     */
	    resolve: (value: any) => void;
	    /**
	     * Function that rejects the contained promise
	     */
	    reject: (value: any) => void;
	    /**
	     * The contained promise that can be resolved and rejected by calling the respective functions
	     */
	    readonly promise: Promise<any>;
	    private _promise;
	    constructor();
	}

}
declare module 'zerokit-web-sdk/src/iframes/iframeHandler' {
	/// <reference types="core-js" />
	/**
	 * This class is a base class of all iframe wrappers, handling communication with wrapped iframes and transforming calls to Promises
	 */
	export class IframeHandler {
	    /**
	     * The origin of the iframe to handle. Used to check if the iframe was redirected.
	     */
	    protected embeddedApiOrigin: string;
	    /**
	     * The embedded iframe
	     */
	    private iframe;
	    /**
	     * A map of callbacks to be called on certain event types
	     */
	    private eventCallbacks;
	    /**
	     * A list of pending calls/promises
	     */
	    private pending;
	    /**
	     * The call id counter. This id is used to match responses to calls
	     */
	    private idCounter;
	    /**
	     * A promise that resolves when the iframe is properly loaded. We wait for this before any calls.
	     */
	    private loadPromise;
	    /**
	     * A promise that resolves if the handler successfully subscribed to the events inside the iframe
	     */
	    private eventSubscribePromise;
	    constructor(embeddedApiOrigin: string, iframe: HTMLIFrameElement);
	    /**
	     * This handles messages to the current window, filtering for ones coming from the iframe
	     * @param event The message to be handled
	     */
	    private handleResponse(event);
	    /**
	     * Call a remote method on the iframe. Always returns a promise
	     * @param cmd The name of the remote method
	     * @param args The arguments to be sent
	     * @param iframeIdProm Some special calls that need to read inputs on other iframes require an iframe id.
	     * @return {Promise<any>} Resolves or rejects based on the result of the method inside the iframe
	     */
	    call(cmd: string, args?: any[], iframeIdProm?: Promise<string>): Promise<any>;
	    /**
	     * Registers a callback to call on an event of the given type
	     * @param type The type of event that should call the callback function
	     * @param callback The callback function to call
	     * @return {Promise<null>} Resolves when the subscription was successful
	     */
	    onEvent(type: string, callback: (target: string) => void): Promise<null>;
	}

}
declare module 'zerokit-web-sdk/src/iframes/inputIframe' {
	/// <reference types="core-js" />
	import { IframeHandler } from 'zerokit-web-sdk/src/iframes/iframeHandler';
	/**
	 * An input iframes handles inputs and doesn't actually do any heavy lifting. They are all hosted on the same origin as the
	 * ApiIframe, so it can read the inputs from there and do the actual calculations.
	 */
	export class InputIframe extends IframeHandler {
	    /**
	     * The idPromise resolves to the id of the iframe used to identify which iframe to read the inputs from.
	     */
	    private idPromise;
	    /**
	     * A reference to the api that will actually handle the calculations
	     */
	    private api;
	    constructor(origin: string, api: IframeHandler, iframe: HTMLIFrameElement);
	    /**
	     * Gets the classes of the element by the given id
	     * @param id The id of the element
	     * @return {Promise<string[]>} Resolves to an array of the classes of the element
	     */
	    getClasses(id: string): Promise<string[]>;
	    /**
	     * Adds a class to the element
	     * @param id The id of the element
	     * @param className The class to add
	     * @return {Promise<null>} Resolves when done
	     */
	    addClass(id: string, className: string): Promise<null>;
	    /**
	     * Removes a class from the element
	     * @param id The id of the element
	     * @param className The class to remove
	     * @return {Promise<null>} Resolves when done
	     */
	    removeClass(id: string, className: string): Promise<null>;
	    /**
	     * Sets the placeholder of the element
	     * @param id The id of the element
	     * @param text The new placeholder text
	     * @return {Promise<null>} Resolves when done
	     */
	    setPlaceholder(id: string, text: string): Promise<null>;
	    /**
	     * Registers a callback that will be called when the enter key is pressed in the iframe
	     * @param callback The callback to call
	     * @return {Promise<null>} Resolves after successful subscription
	     */
	    onEnter(callback: (targetId: string) => void): Promise<null>;
	    /**
	     * Registers a callback that will be called when an input gets focus in the iframe
	     * @param callback The callback to call
	     * @return {Promise<null>} Resolves after successful subscription
	     */
	    onFocus(callback: (targetId: string) => void): Promise<null>;
	    /**
	     * Registers a callback that will be called when an input gets focus in the iframe
	     * @param callback The callback to call
	     * @return {Promise<null>} Resolves after successful subscription
	     */
	    onBlur(callback: (targetId: string) => void): Promise<null>;
	    /**
	     * Call to the main iframe passing it the id of the iframe handled by this object.
	     * This is usually a use input dependent operation that needs to read a password
	     * @param method The method to call
	     * @param args The arguments to pass
	     * @return {Promise<any>} Resolves or rejects based on the result of the remote method
	     */
	    apiCall(method: string, args: any[]): Promise<any>;
	}

}
declare module 'zerokit-web-sdk/src/utils/pathData' {
	export interface PathData {
	    origin: string;
	    path: string;
	    loginPath: string;
	    registerPath: string;
	    acceptInvitationLinkPath: string;
	    createInvitationLinkPath: string;
	    changePasswordPath: string;
	    authPath: string;
	}

}
declare module 'zerokit-web-sdk/src/users/loginIframe' {
	/// <reference types="core-js" />
	import { InputIframe } from 'zerokit-web-sdk/src/iframes/inputIframe';
	import { IframeHandler } from 'zerokit-web-sdk/src/iframes/iframeHandler';
	import { PathData } from 'zerokit-web-sdk/src/utils/pathData';
	/**
	 * This interface is needed because the project can't include the full es6 promises
	 */
	export interface Thenable {
	    then: (res: (r: any) => any, rej: (r: any) => any) => Thenable;
	}
	/**
	 * Callback passed in by the user
	 */
	export type LoginCallback = (userId: string, willRedirect: boolean) => (Thenable | any);
	/**
	 * The response of the login call
	 */
	export type LoginResponse = {
	    needsRedirect: boolean;
	    userId: string;
	};
	export class LoginIframe extends InputIframe {
	    /**
	     * Url indicating where we must redirect to if this is part of an IDP login process
	     */
	    private authPath;
	    constructor(embedded_data: PathData, api: IframeHandler, iframe: HTMLIFrameElement);
	    /**
	     * Logs in the user with the password entered in the iframe and the userId provided
	     * If the login was part of an IDP login process the returned promise never resolves
	     * @param userId The id of the user trying to log in
	     * @param callback An optional callback to call after a successful login, regardless of redirection.
	     * @return {Promise<string>} Resolves to the userId if there was no redirection
	     */
	    login(userId: string, callback?: LoginCallback): Promise<string>;
	}

}
declare module 'zerokit-web-sdk/src/utils/passwordMetrics' {
	export interface PasswordMetrics {
	    /**
	     * 0-4 score of the password calculated by zxcvbn
	     *
	     * 0 # too guessable: risky password. (guesses < 10^3)
	     * 1 # very guessable: protection from throttled online attacks. (guesses < 10^6)
	     * 2 # somewhat guessable: protection from unthrottled online attacks. (guesses < 10^8)
	     * 3 # safely unguessable: moderate protection from offline slow-hash scenario. (guesses < 10^10)
	     * 4 # very unguessable: strong protection from offline slow-hash scenario. (guesses >= 10^10)
	     */
	    score: number;
	    /**
	     * The length of the password
	     */
	    length: number;
	    /**
	     * Feedback provided by zxcvbn on how to improve password strength
	     */
	    feedback: {
	        warning: string;
	        suggestions: string[];
	    };
	    /**
	     * The order of magnitude of the estimated amount of guesses that would be needed to brute-force the password
	     */
	    guesses_log10: number;
	}

}
declare module 'zerokit-web-sdk/src/utils/rejection' {
	/// <reference types="core-js" />
	/**
	 * Returns a rejected Promise<any> with a properly typed error value
	 * @param code Error code
	 * @param description Error description
	 * @return {Promise<any>} The rejected promise
	 */
	export function rejection(code: string, description: string): Promise<any>;

}
declare module 'zerokit-web-sdk/src/users/registerIframe' {
	/// <reference types="core-js" />
	import { InputIframe } from 'zerokit-web-sdk/src/iframes/inputIframe';
	import { PasswordMetrics } from 'zerokit-web-sdk/src/utils/passwordMetrics';
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
	    register(userId: string, regId: string): Promise<RegistrationResponse>;
	    /**
	     * Tries to log in the user with the password entered into the iframe with the id provided.
	     * This method can be used to log the user in right after registration, but it has to be noted,
	     * that the user has to be validated before that is possible.
	     * @param userId The id of the user logging in
	     * @return {Promise<string>} Resolves to the id of logged in user
	     */
	    login(userId: string): Promise<string>;
	    /**
	     * Checks if the passwords match in the password and the confirmation inputs
	     * @return {Promise<boolean>}
	     */
	    checkPasswordMatch(): Promise<boolean>;
	    /**
	     * Returns some information on the strength of the password calculated by zxcvbn
	     * @return {Promise<PasswordMetrics>}
	     */
	    getPasswordStrength(): Promise<PasswordMetrics>;
	}

}
declare module 'zerokit-web-sdk/src/tresors/acceptInvitationLinkIframe' {
	/// <reference types="core-js" />
	import { InputIframe } from 'zerokit-web-sdk/src/iframes/inputIframe';
	/**
	 * This wraps an iframe that can be used to have the user enter the password to an invitation link to accept it
	 */
	export class AcceptInvitationLinkIframe extends InputIframe {
	    /**
	     * This method tries to accept the invitation link represented by the token unlocked by the password entered by the user into this iframe
	     * @param token A token yout get as the $token member returned by the getInvitationLinkInfo method, representing an invitation link
	     * @return {Promise<string>} The operation id that has to be approved to actually add the member to the tresor
	     */
	    acceptInvitationLink(token: any): Promise<string>;
	}

}
declare module 'zerokit-web-sdk/src/tresors/createLinkResponse' {
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

}
declare module 'zerokit-web-sdk/src/tresors/createInvitationLinkIframe' {
	/// <reference types="core-js" />
	import { InputIframe } from 'zerokit-web-sdk/src/iframes/inputIframe';
	import { PasswordMetrics } from 'zerokit-web-sdk/src/utils/passwordMetrics';
	import { CreateLinkResponse } from 'zerokit-web-sdk/src/tresors/createLinkResponse';
	export class CreateInvitationLinkIframe extends InputIframe {
	    /**
	     * Creates an invitation link with the password entered into the iframe
	     * @param linkBase The start of the link. The secret will be added to the end of this string after a #
	     * @param tresorId The id of the tresor the invitee will be added to after accepting
	     * @param {string?} message Optional additional data that can be retrieved with getInvitationLinkInfo
	     * @return {Promise<CreateLinkResponse>} The url is the actual link created that will be enabled after operation is approved by the returned id
	     */
	    createInvitationLink(linkBase: string, tresorId: string, message: string): Promise<CreateLinkResponse>;
	    /**
	     * Checks if the passwords match in the password and the confirmation inputs
	     * @return {Promise<boolean>} Indicates if the passwords match
	     */
	    checkPasswordsMatch(): Promise<boolean>;
	    /**
	     * Returns some information on the strength of the password calculated by zxcvbn
	     * @return {Promise<PasswordMetrics>} Password metadata
	     */
	    getPasswordStrength(): Promise<PasswordMetrics>;
	}

}
declare module 'zerokit-web-sdk/src/users/changePasswordIframe' {
	/// <reference types="core-js" />
	import { InputIframe } from 'zerokit-web-sdk/src/iframes/inputIframe';
	import { PasswordMetrics } from 'zerokit-web-sdk/src/utils/passwordMetrics';
	export class ChangePasswordIframe extends InputIframe {
	    /**
	     * Changes the password of the user
	     * @param userId The id of the user
	     * @return {Promise<string>} The id of the user
	     */
	    changePassword(userId?: string): Promise<string>;
	    /**
	     * Checks if the passwords match in the password and the confirmation inputs
	     * @return {Promise<boolean>}
	     */
	    checkPasswordsMatch(): Promise<boolean>;
	    /**
	     * Returns some information on the strength of the password calculated by zxcvbn
	     * @return {Promise<PasswordMetrics>}
	     */
	    getPasswordStrength(): Promise<PasswordMetrics>;
	}

}
declare module 'zerokit-web-sdk/src/iframes/iframes' {
	import { LoginIframe } from 'zerokit-web-sdk/src/users/loginIframe';
	import { RegisterIframe } from 'zerokit-web-sdk/src/users/registerIframe';
	import { AcceptInvitationLinkIframe } from 'zerokit-web-sdk/src/tresors/acceptInvitationLinkIframe';
	import { CreateInvitationLinkIframe } from 'zerokit-web-sdk/src/tresors/createInvitationLinkIframe';
	import { ChangePasswordIframe } from 'zerokit-web-sdk/src/users/changePasswordIframe';
	import { IframeHandler } from 'zerokit-web-sdk/src/iframes/iframeHandler';
	/**
	 * Sets up the sdk, calculating the necessary paths
	 * @param origin The origin of the sdk
	 * @param tenantPath The path of your tenant on the tenant host
	 */
	export function setup(origin?: string, tenantPath?: string): void;
	/**
	 * Returns/sets up the wrapper of the main api iframe
	 * @private
	 * @return {IframeHandler}
	 */
	export function getApiHandler(): IframeHandler;
	/**
	 * Loads and wraps a LoginIframe, returning the wrapped object
	 * @param parentElement The element that the iframe will be added to
	 * @return {LoginIframe}
	 */
	export function getLoginIframe(parentElement: HTMLElement): LoginIframe;
	/**
	 * Wraps the iframe as a LoginIframe
	 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-login.html"
	 * @param iframe The iframe to be wrapped
	 * @return {LoginIframe}
	 */
	export function wrapLoginIframe(iframe: HTMLIFrameElement): LoginIframe;
	/**
	 * Loads and wraps a RegistrationIframe.
	 * @param parentElement The element that the iframe will be added to
	 * @return {RegisterIframe}
	 */
	export function getRegistrationIframe(parentElement: HTMLElement): RegisterIframe;
	/**
	 * Wraps the iframe as a RegistrationIframe
	 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-register.html"
	 * @param iframe
	 * @return {RegisterIframe}
	 */
	export function wrapRegistrationIframe(iframe: HTMLIFrameElement): RegisterIframe;
	/**
	 * Wraps and load a CreateInvitationLinkIframe
	 * @param parentElement The element that the iframe will be added to
	 * @return {CreateInvitationLinkIframe}
	 */
	export function getCreateInvitationLinkPasswordIframe(parentElement: HTMLElement): CreateInvitationLinkIframe;
	/**
	 * Wraps the given iframe as a CreateInvitationLinkIframe
	 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-createInvitationLink.html"
	 * @return {CreateInvitationLinkIframe}
	 */
	export function wrapCreateInvitationLinkPasswordIframe(iframe: HTMLIFrameElement): CreateInvitationLinkIframe;
	/**
	 * Loads and wraps an AcceptInvitationLinkPasswordIframe
	 * @param parentElement The element that the iframe will be added to
	 * @return {AcceptInvitationLinkIframe}
	 */
	export function getAcceptInvitationLinkPasswordIframe(parentElement: HTMLElement): AcceptInvitationLinkIframe;
	/**
	 * Wraps the given element as AcceptInvitationLinkPasswordIframe
	 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-acceptInvitationLink.html"
	 * @return {AcceptInvitationLinkIframe}
	 */
	export function wrapAcceptInvitationLinkPasswordIframe(iframe: HTMLIFrameElement): AcceptInvitationLinkIframe;
	/**
	 * Loads and wraps a ChangePasswordIframe
	 * @param parentElement The element that the iframe will be added to
	 * @return {ChangePasswordIframe}
	 */
	export function getChangePasswordIframe(parentElement: HTMLElement): ChangePasswordIframe;
	/**
	 * Wraps the given element as a ChangePasswordIframe
	 * Doesn't check the source of the iframe, should be: "${YourServiceUrl}/static/${SdkVersion}/embedded-changePassword.html"
	 * @return {ChangePasswordIframe}
	 */
	export function wrapChangePasswordIframe(iframe: HTMLIFrameElement): ChangePasswordIframe;

}
declare module 'zerokit-web-sdk/src/encryption/encryption' {
	/// <reference types="core-js" />
	/**
	 * Encrypts the data in the context of the tresor
	 * @param {string} tresorId The id of the tresor to encrypt with
	 * @param {string} plainText The text to encrypt
	 * @return {Promise<string>} Encrypted text, base64 encoded
	 */
	export function encrypt(tresorId: string, plainText: string): Promise<string>;
	/**
	 * Decrypts the data
	 * @param {string} cipherText Encrypted text
	 * @return {Promise<string>} Decrypted text
	 */
	export function decrypt(cipherText: string): Promise<string>;
	/**
	 * Encrypts the data in the context of the tresor
	 * @param {string} tresorId The id of the tresor to encrypt with
	 * @param {Uint8Array} plainBytes The data to encrypt
	 * @return {Promise<Uint8Array>} Encrypted data
	 */
	export function encryptBytes(tresorId: string, plainBytes: Uint8Array): Promise<Uint8Array>;
	/**
	 * Decrypts the data
	 * @param {Uint8Array} cipherText The encrypted data
	 * @return {Promise<Uint8Array>} Decrypted data
	 */
	export function decryptBytes(cipherText: Uint8Array): Promise<Uint8Array>;
	/**
	 * Encrypts the Blob or File in the context of the tresor
	 * @param {string} tresorId The id of the tresor to encrypt the data with
	 * @param {Blob|File} plainBlobLike The data to encrypt
	 * @return {Promise<Blob>} Encrypted Blob
	 */
	export function encryptBlob(tresorId: string, plainBlobLike: Blob | File): Promise<Blob>;
	/**
	 * Decrypts the Blob or File
	 * @param {Blob|File} encryptedBlobLike The data to decrypt
	 * @return {Promise<Blob>} Decrypted Blob
	 */
	export function decryptBlob(encryptedBlobLike: Blob | File): Promise<Blob>;

}
declare module 'zerokit-web-sdk/src/tresors/tresors' {
	/// <reference types="core-js" />
	/**
	 * Create a new tresor. The tresor is only usable after the it is approved.
	 * @return {Promise.<string>} The id of the tresor
	 */
	export function createTresor(): Promise<string>;
	/**
	 * Share a tresor with a user, effective after the returned id is approved.
	 * @param {string} tresorId The id of the tresor
	 * @param {string} userId The id of the invitee
	 * @return {Promise<string>} The operation id that has to be approved before the invitee can access the tresor
	 */
	export function shareTresor(tresorId: string, userId: string): Promise<string>;
	/**
	 * Kick a user from a tresor, effective after the returned id is approved.
	 * @param {string} tresorId The id of the tresor
	 * @param {string} userId The id of the user to kick
	 * @return {Promise<string>} The operation id that has to be approved before the kick is effective.
	 */
	export function kickFromTresor(tresorId: string, userId: string): Promise<any>;

}
declare module 'zerokit-web-sdk/src/tresors/invitationLinkPublicInfo' {
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

}
declare module 'zerokit-web-sdk/src/tresors/invitationLinks' {
	/// <reference types="core-js" />
	import { CreateLinkResponse } from 'zerokit-web-sdk/src/tresors/createLinkResponse';
	import { InvitationLinkPublicInfo } from 'zerokit-web-sdk/src/tresors/invitationLinkPublicInfo';
	/**
	 * Creates a link that can be used to gain access to the tresor.
	 * @param {string} baseLink The start of the link. The link secret will be appended to this after a #
	 * @param {string} tresorId The id of the tresor to share
	 * @param {string?} message Optional additional data that can be retrieved with getInvitationLinkInfo
	 * @return {Promise<CreateLinkResponse>} The url is the actual link created that will be enabled after operation is approved by the returned id
	 */
	export function createInvitationLinkNoPassword(baseLink: string, tresorId: string, message: string): Promise<CreateLinkResponse>;
	/**
	 * Revokes the link. If approved, the link won't be usable.
	 * @param {string} tresorId The id of the tresor the link is for
	 * @param {string} secret The secret provided in the link after the #
	 * @return {Promise<string>} The operation id that has to be approved before this is effective
	 */
	export function revokeInvitationLink(tresorId: string, secret: string): Promise<string>;
	/**
	 * Returns information about the link, and the token that can be used along with an optional password to accept the invitation.
	 * @param {string} secret The secret provided in the link after the #
	 * @return {Promise<InvitationLinkPublicInfo>} Information about the link available without entering a password.
	 */
	export function getInvitationLinkInfo(secret: string): Promise<InvitationLinkPublicInfo>;
	/**
	 * Adds the user to the tresor the link was for, but it will only be effective after the returned operation id is approved.
	 * @param {Object} token The token returned by getInvitationLinkInfo
	 * @return {Promise<string>} The operation id that has to be approved before this is effective
	 */
	export function acceptInvitationLinkNoPassword(token: any): Promise<string>;

}
declare module 'zerokit-web-sdk/src/users/user' {
	/// <reference types="core-js" />
	/**
	 * Returns the currently logged in user
	 * @return {Promise<string | null>} The id of the current user, or null if there is no logged in user
	 */
	export function whoAmI(): Promise<any>;
	/**
	 * Logs the current user out from the zkit. Important to note, that this doesn't clear the idp state.
	 * @return {Promise} Resolves on success.
	 */
	export function logout(): Promise<any>;

}
declare module 'zerokit-web-sdk/src/index' {
	export { getAcceptInvitationLinkPasswordIframe, wrapAcceptInvitationLinkPasswordIframe, getChangePasswordIframe, wrapChangePasswordIframe, getCreateInvitationLinkPasswordIframe, wrapCreateInvitationLinkPasswordIframe, getLoginIframe, wrapLoginIframe, getRegistrationIframe, wrapRegistrationIframe, setup } from 'zerokit-web-sdk/src/iframes/iframes';
	export { createTresor, shareTresor, kickFromTresor } from 'zerokit-web-sdk/src/tresors/tresors';
	export { createInvitationLinkNoPassword, acceptInvitationLinkNoPassword, getInvitationLinkInfo, revokeInvitationLink } from 'zerokit-web-sdk/src/tresors/invitationLinks';
	export { logout, whoAmI } from 'zerokit-web-sdk/src/users/user';
	export { encrypt, encryptBytes, encryptBlob, decrypt, decryptBytes, decryptBlob } from 'zerokit-web-sdk/src/encryption/encryption';

}
declare module 'zerokit-web-sdk' {
	import main = require('zerokit-web-sdk/src/index');
	export = main;
}
