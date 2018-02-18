import * as Glob from "glob";

/**
 * Helper class for working with Globs
 */
export class GlobHelper {
  /**
   * Returns true if the specified string is a glob, false otherwise.
   * @param potentialGlob A string that is a potential glob
   */
  public isGlob(potentialGlob: string): boolean {
    return Glob.hasMagic(potentialGlob);
  }

  /**
   * Returns an array with all the files that match a given glob
   * @param glob The glob to match
   */
  public resolve(glob: string): Array<string> {
    return Glob.sync(glob);
  }
}
