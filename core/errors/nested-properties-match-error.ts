import { MatchError } from "./match-error";

export class NestedPropertiesMatchError extends MatchError {
  public constructor(message: string, path: string, error: Error) {
    /* istanbul ignore next */
    super(
      `Property at path '${path}': ${message}.` +
        "\n" +
        error.message +
        "\n" +
        error.stack
    );
  }
}
