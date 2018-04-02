export const enum EqType {
  /** Recursively compare values of all 'own' properties, strictly (===). */
  deepStrictly = "deepStrictly",

  /** Recursively compare values of all 'own' properties, loosely (==). */
  deepLoosely = "deepLoosely",

  /** Compare loosely (==). */
  loosely = "loosely",

  /** Compare strictly (==). */
  strictly = "strictly"
}
