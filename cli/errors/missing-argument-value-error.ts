export class MissingArgumentValueError extends Error {
   public constructor(argumentName: string) {
      super();

      this.message = `Argument "${argumentName}" requires a value.`;
   }
}
