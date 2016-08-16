export class AlsatianCliOptions {

   private _fileGlobs: Array<string>;
   public get fileGlobs(): Array<string> {
      return this._fileGlobs;
   }

   private _timeout: number = null;
   public get timeout(): number {
      return this._timeout;
   }

   public constructor(args: Array<string>) {

      args = this._extractFileGlobs(args);
      args = this._extractTimeout(args);

      if (args.length > 0) {
         throw new Error("unrecognised arguments " + args.map(argument => argument.replace(/[-]*/, "")).join(" and "));
      }
   }

   private _extractFileGlobs(args: Array<string>) {
      this._fileGlobs = args.filter((value, index) => {
         const previousArgument = args[index - 1];

         if ((!previousArgument || previousArgument[0]) !== "-" && value[0] !== "-") {
            return true;
         }

         return false;
      });

      return args.filter(value => this._fileGlobs.indexOf(value) === -1);
   }

   private _extractTimeout(args: Array<string>) {
      let timeoutValue = this._getArgumentValueFromArgumentList(args, "timeout", "t");

      if (timeoutValue !== null) {

         const timeout = parseInt(timeoutValue);

         if (isNaN(timeout) || timeout.toString() !== timeoutValue) {
            throw new Error("Invalid timeout argument \"" + timeoutValue + "\" given.");
         }

         this._timeout = timeout;

         const argumentIndex = this._getArgumentIndexFromArgumentList(args, "timeout", "t");

         return args.filter((value, index) => {
            return index !== argumentIndex && index !== argumentIndex + 1;
         });
      }

      return args;
   }

   private _getArgumentIndexFromArgumentList(args: Array<string>, argumentName: string, argumentShorthand?: string): number {

      const matchingArguments = args.filter((value, index) => value === "--" + argumentName || value === "-" + argumentShorthand);

      if (matchingArguments.length === 0) {
         return -1;
      }
      else if (matchingArguments.length > 1) {
         throw new Error("Duplicate " + argumentName + " arguments.");
      }

      return args.indexOf(matchingArguments[0]);
   }

   private _getArgumentValueFromArgumentList(args: Array<string>, argumentName: string, argumentShorthand?: string): string {
      const argumentIndex = this._getArgumentIndexFromArgumentList(args, argumentName, argumentShorthand);

      if (argumentIndex === -1) {
         return null;
      }

      const valueArgument = args[argumentIndex + 1];

      if (valueArgument && valueArgument[0] !== "-") {
         return valueArgument;
      }
      else {
         throw new Error("Argument " + argumentName + " was given no value.");
      }
   }
}
