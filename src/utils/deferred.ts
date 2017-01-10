import * as Promise from "core-js/library/es6/promise";

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
  public get promise() { return this._promise; }
  private _promise: Promise<any>;

  constructor() {
    this._promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
