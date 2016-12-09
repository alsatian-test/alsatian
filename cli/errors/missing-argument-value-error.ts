import { AlsatianError } from "../../core/_errors";

export class MissingArgumentValueError extends AlsatianError {
   public constructor(argumentName: string) {
      super();

      this.message = `Argument "${argumentName}" requires a value.`;
   }
}
