import { MatchError } from "../errors";

export class PropertySetMatchError extends MatchError {

  public constructor(actualValue: any, shouldMatch: boolean, value?: any) {

    super(
    `Expected property ${!shouldMatch ? "not " : ""}to be set` +
    `${arguments.length === 3 ? " to " + JSON.stringify(value) + "" : ""}.`);

    const setCalls = actualValue.setCalls;

    this._actual =
    `property was ${shouldMatch && !(arguments.length === 3 && setCalls.length) ? "not " : ""}` +
    `set${arguments.length === 3 && setCalls.length ? " to " + this._stringifyArguments(setCalls) : ""}.`;

    this._expected =
    `property ${!shouldMatch ? "not " : ""}to be set${arguments.length === 3 ? " to " + JSON.stringify(value) : ""}.`;
  }

  private _stringifyArguments(setCalls: any): string {
    return setCalls.map((call: any) => JSON.stringify(call.args[0])).join(", ");
  }
}
