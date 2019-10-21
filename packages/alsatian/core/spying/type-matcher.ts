import { stringify } from "../stringification";
import { ITester, INameable } from "../_interfaces";
import { ISpyMatcher } from "./spy-matcher.i";
import { MatcherOrType } from "./matcher-or-type";
import { MatcherArgument } from "./matcher-argument";

export class TypeMatcher<ExpectedType extends object> implements ISpyMatcher<ExpectedType> {
	private readonly _testers: Array<ITester> = [];

	public constructor(public readonly type: new (...args: Array<any>) => ExpectedType) {
		if (type === null || type === undefined) {
			throw new TypeError("type must not be null or undefined");
		}

		this._testers.push({
			stringify: () => `Any ${(this.type as INameable).name}`,
			test: (value: any) => {
				if ((type as any) === String) {
					return (
						typeof value === "string" || value instanceof this.type
					);
				} else if ((type as any) === Number) {
					return (
						typeof value === "number" || value instanceof this.type
					);
				} else if ((type as any) === Boolean) {
					return (
						typeof value === "boolean" ||
						value instanceof this.type
					);
				} else {
					return value instanceof this.type;
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

	public thatMatches<Key extends keyof ExpectedType>(
		first: MatcherArgument<ExpectedType, Key>,
		second?: ExpectedType[Key]
	): MatcherOrType<ExpectedType> {
		if (null === first || undefined === first) {
			throw new TypeError(
				"thatMatches requires none-null or non-undefined argument"
			);
		}

		if (typeof first === "string") {
			return this._matchesKeyAndValue(first, second);
		}

		if (typeof first === "function") {
			// cast required for node 6 remove when out of LTS
			return this._matchesDelegate(first as (
				argument: ExpectedType
			) => boolean);
		}

		if (typeof first === "object") {
			return this._matchesObjectLiteral(first);
		}

		throw new Error("Invalid arguments");
	}

	private _matchesKeyAndValue(key: string, value: any): MatcherOrType<ExpectedType> {
		this._testers.push({
			stringify: () =>
				`with property '${key}' equal to '${stringify(value)}'`,
			test: (v: any) => {
				if (Object.getOwnPropertyNames(v).indexOf(key) < 0) {
					return false;
				}

				return v[key] === value;
			}
		});

		return this._thisAsMatcherOrType();
	}

	private _matchesDelegate(
		delegate: (argument: ExpectedType) => boolean
	): MatcherOrType<ExpectedType> {
		this._testers.push({
			stringify: () => `matches '${delegate.toString()}'`,
			test: (v: any) => delegate(v)
		});

		return this._thisAsMatcherOrType();
	}

	private _matchesObjectLiteral(properties: object): MatcherOrType<ExpectedType> {
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

		return this._thisAsMatcherOrType();
	}

	private _thisAsMatcherOrType() {
		return this as unknown as MatcherOrType<ExpectedType>;
	}
}
