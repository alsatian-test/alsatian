import { stringify } from "../stringification";
import { ITester, INameable } from "../_interfaces";
import { ISpyMatcher } from "./spy-matcher.i";
import { MatcherOrType } from "./matcher-or-type";
import { MatcherArgument } from "./matcher-argument";

export class TypeMatcher<ExpectedType extends object> implements ISpyMatcher<ExpectedType> {
	private readonly testers: Array<ITester> = [];

	public constructor(public readonly type: new (...args: Array<any>) => ExpectedType) {
		if (type === null || type === undefined) {
			throw new TypeError("type must not be null or undefined");
		}

		this.testers.push({
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
		return this.testers.every(tester => tester.test(value));
	}

	public stringify(): string {
		return this.testers.map(tester => tester.stringify()).join(" and ");
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
			return this.matchesKeyAndValue(first, second);
		}

		if (typeof first === "function") {
			// cast required for node 6 remove when out of LTS
			return this.matchesDelegate(first as (
				argument: ExpectedType
			) => boolean);
		}

		if (typeof first === "object") {
			return this.matchesObjectLiteral(first);
		}

		throw new Error("Invalid arguments");
	}

	private matchesKeyAndValue(key: string, value: any): MatcherOrType<ExpectedType> {
		this.testers.push({
			stringify: () =>
				`with property '${key}' equal to '${stringify(value)}'`,
			test: (v: any) => {
				if (Object.getOwnPropertyNames(v).indexOf(key) < 0) {
					return false;
				}

				return v[key] === value;
			}
		});

		return this.thisAsMatcherOrType();
	}

	private matchesDelegate(
		delegate: (argument: ExpectedType) => boolean
	): MatcherOrType<ExpectedType> {
		this.testers.push({
			stringify: () => `matches '${delegate.toString()}'`,
			test: (v: any) => delegate(v)
		});

		return this.thisAsMatcherOrType();
	}

	private matchesObjectLiteral(properties: object): MatcherOrType<ExpectedType> {
		this.testers.push({
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

		return this.thisAsMatcherOrType();
	}

	private thisAsMatcherOrType() {
		return this as unknown as MatcherOrType<ExpectedType>;
	}
}
