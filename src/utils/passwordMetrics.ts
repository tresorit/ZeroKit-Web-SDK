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
    warning: string /** explains what's wrong, eg. 'this is a top-10 common password'. not always set -- sometimes an empty string */
    suggestions: string[] /** a possibly-empty list of suggestions to help choose a less guessable password. eg. 'Add another word or two' */
  };

  /**
   * The order of magnitude of the estimated amount of guesses that would be needed to brute-force the password
   */
  guesses_log10: number;
}
