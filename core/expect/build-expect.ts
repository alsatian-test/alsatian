import "reflect-metadata";
import { 
  MixedMatcher,
  PropertyMatcher,
  FunctionMatcher,
  ContainerMatcher,
  EmptyMatcher,
  StringMatcher,
  NumberMatcher
} from "../matchers";
import { IExpect } from "./expect.i";
import { fail } from "./fail";
import { Matcher } from "../matchers";
import { PropertySpy, FunctionSpy } from "../spying";
import { TestPlan } from "../running";

export declare type MatcherConstructor = new (actualValue: any) => MixedMatcher;
export declare type MatcherFunction = (actualValue: any) => MixedMatcher;

export function buildExpect(): IExpect {
  const EXPECT = ExpectFunction as IExpect;
  EXPECT.fail = fail;
  EXPECT.extend = (<P, S extends Matcher<P>>(a: new (...args: any[]) => P, b: new(value: P, testItem: any) => S) => {
    MATCHER_MAP.push([a, b]);
    return EXPECT;
  }) as any;
  
  return EXPECT;
}

type MatcherDictionary<T> = [new (...args: any[]) => T, new(value: T, testItem: any) => Matcher<T>];

const MATCHER_MAP: Array<MatcherDictionary<any>> = [
  [Array, ContainerMatcher],
  [FunctionSpy, FunctionMatcher],
  [PropertySpy, PropertyMatcher],
  [Object, EmptyMatcher]
];

function ExpectFunction<ActualType>(
  actualValue: ActualType
): Matcher<ActualType> {
  const TEST_PLAN = Reflect.getMetadata("alsatian:test-plan", ExpectFunction) as TestPlan;
  const STACK = getStack();
  const STACK_LINE = STACK[STACK.findIndex(x => /Object.ExpectFunction/.test(x.functionName)) + 1];

  const TEST_ITEM = TEST_PLAN.testItems.find(x => {
    return x.testFixture.filePath.replace(/\//g, "\\") === STACK_LINE.filePath 
        && x.test.key === STACK_LINE.functionName.split(".")[1]
  });

  const MATCHER = findMatcher(actualValue);
  return new MATCHER(actualValue, TEST_ITEM);
}

function getStack() {
  return new Error().stack.split("\n").map(stackLine => {
    const STACK_ITEMS = stackLine.replace(/^\s*at (.+) \((.+):\d+:\d+\)$/, "$1 $2").split(" ");

    return {
      functionName: STACK_ITEMS[0],
      filePath: STACK_ITEMS[1]
    }
  });
}

function findMatcher<T>(actualValue: T): new(value: T, testItem: any) => Matcher<T> {
  if (typeof actualValue === "function") {
    return FunctionMatcher;
  }

  if (typeof actualValue === "string") {
    return StringMatcher as any;
  }

  if (typeof actualValue === "number") {
    return NumberMatcher as any;
  }
  
  if (actualValue === null || actualValue === undefined) {
    return Matcher;
  }

  const proto = Object.getPrototypeOf(actualValue);
  
  if (proto === null) {
    return Matcher;
  }

  const match = MATCHER_MAP.find((x) => x[0] === proto.constructor);

  return match ? match[1] : findMatcher(proto);
}
