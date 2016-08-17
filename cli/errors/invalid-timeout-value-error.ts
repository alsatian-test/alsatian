
export class InvalidTimeoutValueError extends Error {
   public constructor(timeoutValue: string) {
      super();

      this.message = `Invalid timeout value "${timeoutValue}" given.`;
   }
}
