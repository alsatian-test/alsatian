import ExtendoError from "extendo-error";

export class InvalidArgumentNamesError extends ExtendoError {

   public constructor(argumentNames: Array<string>) {
      super();

      if (argumentNames.length === 1) {
         this.message = `unrecognised argument "${this._extractArgumentName(argumentNames[0])}".`;
      }
      else {
         this.message = `unrecognised arguments ${argumentNames.map(this._extractArgumentName).join(" and ")}.`;
      }
   }

   private _extractArgumentName(argument: string) {
       return `"${argument.replace(/[-]*/, "")}"`;
   }
}
