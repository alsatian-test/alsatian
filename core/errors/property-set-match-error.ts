import { MatchError } from "../errors";

export class PropertySetMatchError extends MatchError {

  public constructor(actualValue: any, shouldMatch: boolean, value?: any) {

    super(`Expected property ${!shouldMatch ? "not " : ""}to be set${arguments.length === 3 ? " to " + JSON.stringify(value) + "" : ""}.`);

    this._actual = `property was ${shouldMatch && !(arguments.length === 3 && actualValue.setCalls.length) ? "not " : ""}set${arguments.length === 3 && actualValue.setCalls.length ? " to " + actualValue.setCalls.map((call: any) => JSON.stringify(call.args[0])).join(", ") : ""}.`;
    this._expected = `property ${!shouldMatch ? "not " : ""}to be set${arguments.length === 3 ? " to " + JSON.stringify(value) : ""}.`;
  }
}
