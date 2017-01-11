import * as Glob from "glob";

export class GlobHelper {
   public isGlob(potentialGlob: string): boolean {
      return Glob.hasMagic(potentialGlob);
   }

   public resolve(glob: string): Array<string> {
      return Glob.sync(glob);
   }
}
