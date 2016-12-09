import { AlsatianError } from "../../core/_errors";

export class DuplicateCliArgumentError extends AlsatianError {
   public constructor(argumentName: string) {
      super(`Duplicate "${argumentName}" arguments were provided.`);
   }
}
