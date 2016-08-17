export class DuplicateCliArgumentError extends Error {
   public constructor(argumentName: string) {
      super();

      this.message = `Duplicate "${argumentName}" arguments were provided.`;
   }
}
