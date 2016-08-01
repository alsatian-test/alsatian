import * as Glob from "glob";

export class GlobHelper {
   isGlob(potentialGlob: string): boolean {
      return Glob.hasMagic(potentialGlob);
   }

   resolve(glob: string): Array<string> {
      return Glob.sync(glob);
   }
}
