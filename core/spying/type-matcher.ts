import { stringify } from "../stringification";
import { ITester, INameable } from "../_interfaces";

export class TypeMatcher<ExpectedType extends object> {
  private _testers: Array<ITester> = [];
  private _type: new (...args: Array<any>) => ExpectedType;
  public get type() {
    return this._type;
  }

  public constructor(type: new (...args: Array<any>) => ExpectedType) {
    if (type === null || type === undefined) {
      throw new TypeError("type must not be null or undefined");
    }

    this._type = type;

    this._testers.push({
      stringify: () => `Any ${(this.type as INameable).name}`,
      test: (value: any) => {
        if ((type as any) === String) {
          return typeof value === "string" || value instanceof this._type;
        } else if ((type as any) === Number) {
          return typeof value === "number" || value instanceof this._type;
        } else if ((type as any) === Boolean) {
          return typeof value === "boolean" || value instanceof this._type;
        } else {
          return value instanceof this._type;
        }
      }
    });
  }

  public test(value: any) {
    return this._testers.every(tester => tester.test(value));
  }

  public stringify(): string {
    return this._testers.map(tester => tester.stringify()).join(" and ");
  }

  /* tslint:disable:unified-signatures */
  public thatMatches(key: string, value: any): this;
  public thatMatches(properties: object): this;
  public thatMatches(delegate: (argument: ExpectedType) => boolean): this;
  public thatMatches(
    first: string | object | ((argument: ExpectedType) => boolean),
    second?: any
  ): this {
    if (null === first || undefined === first) {
      throw new TypeError(
        "thatMatches requires none-null or non-undefined argument"
      );
    }

    if (typeof first === "string") {
      return this._matchesKeyAndValue(first, second);
    }

    if (typeof first === "function") {
      return this._matchesDelegate(first);
    }

    if (typeof first === "object") {
      return this._matchesObjectLiteral(first);
    }

    throw new Error("Invalid arguments");
  }
  /* tslint:enable:unified-signatures */

  private _matchesKeyAndValue(key: string, value: any): this {
    this._testers.push({
      stringify: () => `with property '${key}' equal to '${stringify(value)}'`,
      test: (v: any) => {
        if (Object.getOwnPropertyNames(v).indexOf(key) < 0) {
          return false;
        }

        return v[key] === value;
      }
    });

    return this;
  }

  private _matchesDelegate(
    delegate: (argument: ExpectedType) => boolean
  ): this {
    this._testers.push({
      stringify: () => `matches '${delegate.toString()}'`,
      test: (v: any) => delegate(v)
    });

    return this;
  }

  private _matchesObjectLiteral(properties: object): this {
    if (properties.constructor !== Object) {
      throw new TypeError(
        "thatMatches requires value passed in to be an object literal"
      );
    }

    this._testers.push({
      stringify: () => `matches '${stringify(properties)}'`,
      test: (v: any) => {
        const targetKeys = Object.getOwnPropertyNames(v);
        return Object.getOwnPropertyNames(properties).every(key => {
          if (targetKeys.indexOf(key) < 0) {
            return false;
          }

          return v[key] === (properties as any)[key];
        });
      }
    });

    return this;
  }
}
