import { InvalidArgumentNamesError } from "./errors/invalid-argument-names-error";
import { InvalidTimeoutValueError } from "./errors/invalid-timeout-value-error";
import { DuplicateCliArgumentError } from "./errors/duplicate-cli-argument-error";
import { MissingArgumentValueError } from "./errors/missing-argument-value-error";

export class AlsatianCliOptions {

   private _fileGlobs: Array<string>;
   public get fileGlobs(): Array<string> {
      return this._fileGlobs;
   }

   private _timeout: number = null;
   public get timeout(): number {
      return this._timeout;
   }

   private _tap: boolean = false;
   public get tap(): boolean {
      return this._tap;
   }

   private _versionRequested: boolean = false;
   public get versionRequested(): boolean {
      return this._versionRequested;
   }

   private _helpRequested: boolean = false;
   public get helpRequested(): boolean {
      return this._helpRequested;
   }

   public constructor(args: Array<string>) {

      args = this._extractTap(args);
      args = this._extractVersionRequested(args);
      args = this._extractHelpRequested(args);
      args = this._extractFileGlobs(args);
      args = this._extractTimeout(args);

      if (args.length > 0) {
         throw new InvalidArgumentNamesError(args);
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

         if (isNaN(timeout) || timeout < 1 || timeout.toString() !== timeoutValue) {
            throw new InvalidTimeoutValueError(timeoutValue);
         }

         this._timeout = timeout;

         const argumentIndex = this._getArgumentIndexFromArgumentList(args, "timeout", "t");

         // filter out the timeout argument and its value
         return args.filter((value, index) => {
            return index !== argumentIndex && index !== argumentIndex + 1;
         });
      }

      return args;
   }

   private _extractTap(args: Array<string>): Array<string> {
      const argumentIndex = this._getArgumentIndexFromArgumentList(args, "tap", "T");

      // if we found the tap argument, we want to enable tap output
      this._tap = (argumentIndex !== -1);

      // filter out the tap argument and return the other args
      return args.filter((value, index) => {
        return index !== argumentIndex;
      });
   }

   private _extractVersionRequested(args: Array<string>) {
      let versionRequestedIndex = this._getArgumentIndexFromArgumentList(args, "version", "v");

      if (versionRequestedIndex > -1) {

         this._versionRequested = true;

         return args.filter((value, index) => {
            return index !== versionRequestedIndex;
         });
      }

      return args;
   }

   private _extractHelpRequested(args: Array<string>) {
      let helpRequestedIndex = this._getArgumentIndexFromArgumentList(args, "help", "h");

      if (helpRequestedIndex > -1) {

         this._helpRequested = true;

         return args.filter((value, index) => {
            return index !== helpRequestedIndex;
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
         throw new DuplicateCliArgumentError(argumentName);
      }

      return args.indexOf(matchingArguments[0]);
   }

   private _getArgumentValueFromArgumentList(args: Array<string>, argumentName: string, argumentShorthand?: string): string {
      const argumentIndex = this._getArgumentIndexFromArgumentList(args, argumentName, argumentShorthand);

      if (argumentIndex === -1) {
         return null;
      }

      const valueArgument = args[argumentIndex + 1];

      if (valueArgument && (valueArgument[0] !== "-" || !isNaN(parseInt(valueArgument)))) {
         return valueArgument;
      }
      else {
         throw new MissingArgumentValueError(argumentName);
      }
   }
}
