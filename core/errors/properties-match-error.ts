import { MatchError } from "./match-error";

export class PropertiesMatchError extends MatchError {
  public constructor(
    message: string,
    path: string,
    actualValue: any,
    expectedValue: any
  ) {
    /* istanbul ignore next */
    super(
      `Property at path '${path}': ${message}.`,
      expectedValue,
      actualValue
    );
  }
}
