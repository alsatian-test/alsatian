import "reflect-metadata";
import {
	BufferMatcher,
	PropertyMatcher,
	FunctionMatcher,
	ContainerMatcher,
	StringMatcher,
	NumberMatcher
} from "../matchers";
import { IExpect } from "./expect.i";
import { fail } from "./fail";
import { Matcher } from "../matchers";
import { PropertySpy, FunctionSpy, TypeMatcher } from "../spying";
import { ObjectMatcher } from "../matchers/object-matcher";

export function buildExpect(): IExpect {
	const EXPECT = ExpectFunction as IExpect;
	EXPECT.fail = fail;
	EXPECT.extend = (<ExpectedType, MatcherType extends Matcher<ExpectedType>>(
		expectedTypeConstructor: new (...args: Array<any>) => ExpectedType,
		matcherConstructor: new (value: ExpectedType) => MatcherType
	) => {
		MATCHER_MAP.push([expectedTypeConstructor, matcherConstructor]);
		return EXPECT;
	}) as any;

	return EXPECT;
}

type MatcherDictionary<ExpectedType> = [
	new (...args: Array<any>) => ExpectedType,
	new (value: ExpectedType) => Matcher<ExpectedType>
];

const MATCHER_MAP: Array<MatcherDictionary<any>> = [
	[Buffer, BufferMatcher],
	[Array, ContainerMatcher],
	[FunctionSpy, FunctionMatcher],
	[PropertySpy, PropertyMatcher],
	[Object, ObjectMatcher]
];

function ExpectFunction<ActualType>(
	actualValue: ActualType
): Matcher<ActualType> {
	const MATCHER = findMatcher(actualValue);
	return new MATCHER(actualValue);
}

function findMatcher<T>(actualValue: T): new (value: T) => Matcher<T> {
	if (typeof actualValue === "object") {
		return getObjectMatcher(actualValue);
	}

	if (typeof actualValue === "function") {
		return FunctionMatcher;
	}

	return getPrimitiveMatcher(actualValue);
}

function getObjectMatcher<T>(actualValue: T): new (value: T) => Matcher<T> {
	if (actualValue === null || actualValue === undefined) {
		return Matcher;
	}

	const proto = Object.getPrototypeOf(actualValue);

	if (proto === null) {
		return Matcher;
	}

	const match = MATCHER_MAP.find(
		matchPair => matchPair[0] === proto.constructor
	);

	return match ? match[1] : findMatcher(proto);
}

function getPrimitiveMatcher<T>(actualValue: T): new (value: T) => Matcher<T> {
	if (typeof actualValue === "string") {
		return StringMatcher as any;
	}

	if (typeof actualValue === "number") {
		return NumberMatcher as any;
	}

	return Matcher;
}
