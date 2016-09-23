import { MatchError } from "../_errors";

export class PropertySetMatchError extends MatchError {

  public constructor(actualValue: any, shouldMatch: boolean, value?: any) {

    super(actualValue,
          "property to be set",
          `Expected property ${!shouldMatch ? "not " : ""}to be set${arguments.length === 3 ? " to " + JSON.stringify(value) + "" : ""}.`);
  }
}
