import ExtendoError from "extendo-error";

export class InvalidTimeoutValueError extends ExtendoError {
   public constructor(timeoutValue: string) {
      super();

      this.message = `Invalid timeout value "${timeoutValue}" given.`;
   }
}
