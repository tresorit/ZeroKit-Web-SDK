import * as Promise from "core-js/library/es6/promise";

import { getApiHandler } from "../iframes/iframes";
import { rejection } from "../utils/rejection";

/**
 * Encrypts the data in the context of the tresor
 * @param {string} tresorId The id of the tresor to encrypt with
 * @param {string} plainText The text to encrypt
 * @return {Promise<string>} Encrypted text, base64 encoded
 */
export function encrypt(tresorId: string, plainText: string): Promise<string> {
  if (!tresorId)
    return rejection("BadInput", "tresorId cannot be empty");
  if (plainText === null || plainText === undefined)
    return rejection("BadInput", "plainText cannot be null or undefined");
  return getApiHandler().call("encrypt", [tresorId, plainText]);
}

/**
 * Decrypts the data
 * @param {string} cipherText Encrypted text
 * @return {Promise<string>} Decrypted text
 */
export function decrypt(cipherText: string): Promise<string> {
  if (!cipherText)
    return rejection("BadInput", "cipherText cannot be empty");
  return getApiHandler().call("decrypt", [cipherText]);
}

/**
 * Encrypts the data in the context of the tresor
 * @param {string} tresorId The id of the tresor to encrypt with
 * @param {Uint8Array} plainBytes The data to encrypt
 * @return {Promise<Uint8Array>} Encrypted data
 */
export function encryptBytes(tresorId: string, plainBytes: Uint8Array): Promise<Uint8Array> {
  if (!tresorId)
    return rejection("BadInput", "tresorId cannot be empty");
  if (plainBytes === null || plainBytes === undefined)
    return rejection("BadInput", "plainText cannot be null or undefined");
  return getApiHandler().call("encryptBytes", [tresorId, plainBytes]);
}

/**
 * Decrypts the data
 * @param {Uint8Array} cipherText The encrypted data
 * @return {Promise<Uint8Array>} Decrypted data
 */
export function decryptBytes(cipherText: Uint8Array): Promise<Uint8Array> {
  if (!cipherText)
    return rejection("BadInput", "cipherText cannot be empty");
  return getApiHandler().call("decryptBytes", [cipherText]);
}

/**
 * Encrypts the Blob or File in the context of the tresor
 * @param {string} tresorId The id of the tresor to encrypt the data with
 * @param {Blob|File} plainBlobLike The data to encrypt
 * @return {Promise<Blob>} Encrypted Blob
 */
export function encryptBlob(tresorId: string, plainBlobLike: Blob|File): Promise<Blob> {
  if (!tresorId)
    return rejection("BadInput", "tresorId cannot be empty");
  if (plainBlobLike === null || plainBlobLike === undefined)
    return rejection("BadInput", "plainBlobLike cannot be null or undefined");
  return getApiHandler().call("encryptBlob", [tresorId, plainBlobLike]);
}

/**
 * Decrypts the Blob or File
 * @param {Blob|File} encryptedBlobLike The data to decrypt
 * @return {Promise<Blob>} Decrypted Blob
 */
export function decryptBlob(encryptedBlobLike: Blob|File): Promise<Blob> {
  if (!encryptedBlobLike)
    return rejection("BadInput", "encryptedBlobLike cannot be empty");
  return getApiHandler().call("decryptBlob", [encryptedBlobLike]);
}
