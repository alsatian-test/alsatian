import { AlsatianError } from "../../core/_errors";

export class InvalidTimeoutValueError extends AlsatianError {
   public constructor(timeoutValue: string) {
      super();

      this.message = `Invalid timeout value "${timeoutValue}" given.`;
   }
}
