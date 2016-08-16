export class AlsatianCliOptions {

   private _fileGlobs: Array<string>;
   public get fileGlobs(): Array<string> {
      return this._fileGlobs;
   }

   private _timeout: number;
   public get timeout(): number {
      return this._timeout;
   }

   public constructor(args: Array<string>) {
      this._extractFileGlobs(args);
   }

   private _extractFileGlobs(args: Array<string>) {
      this._fileGlobs = args.filter((value, index) => {
         const previousArgument = args[index - 1];

         if ((!previousArgument || previousArgument[0]) !== "-" && value[0] !== "-") {
            return value;
         }
      });
   }
}
