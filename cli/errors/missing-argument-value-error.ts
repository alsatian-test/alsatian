import ExtendoError from "extendo-error";

export class MissingArgumentValueError extends ExtendoError {
   public constructor(argumentName: string) {
      super();

      this.message = `Argument "${argumentName}" requires a value.`;
   }
}
