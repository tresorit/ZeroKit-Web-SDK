import * as Promise from "core-js/library/es6/promise";

/**
 * An extension of the basic Error class with added code and description fields
 */
class JsSdkError extends Error {
  /**
   * Error code and message of the base class
   * eg.: BadInput
   */
  code: string;

  /**
   * Description of the error
   * e.g.: tresorId and userId cannot be empty
   */
  description: string;

  constructor(code: string, desc: string) {
    super(code);
    this.code = code;
    this.description = desc;
  }
}

/**
 * Returns a rejected Promise<any> with a properly typed error value
 * @param code Error code
 * @param description Error description
 * @return {Promise<any>} The rejected promise
 */
export function rejection(code: string, description: string): Promise<any> {
  return Promise.reject<any>(new JsSdkError(code, description));
}
