import ExtendoError from "extendo-error";

export class DuplicateCliArgumentError extends ExtendoError {
   public constructor(argumentName: string) {
      super(`Duplicate "${argumentName}" arguments were provided.`);
   }
}
