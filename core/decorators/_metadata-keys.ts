// currently typing these values to string as literal causes
// backwards compatibility issues consider replacing when support
// for TypeScript < 2.1 is dropped
// see:  https://github.com/alsatian-test/alsatian/issues/251
// also: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes
//       #literal-types-are-inferred-by-default-for-const-variables-and-readonly-properties

export const TEST_FIXTURE: "alsatian:test-fixture" = "alsatian:test-fixture";
export const TESTS: "alsatian:tests" = "alsatian:tests";
export const FOCUS: "alsatian:focus" = "alsatian:focus";
export const IGNORE: "alsatian:ignore" = "alsatian:ignore";
export const IGNORE_REASON: "alsatian:ignore-reason" = "alsatian:ignore-reason";
export const SETUP: "alsatian:setup" = "alsatian:setup";
export const SETUP_FIXTURE: "alsatian:setup-fixture" = "alsatian:setup-fixture";
export const TEARDOWN: "alsatian:teardown" = "alsatian:teardown";
export const TEARDOWN_FIXTURE: "alsatian:teardown-fixture" =
  "alsatian:teardown-fixture";
export const TEST_CASES: "alsatian:testcases" = "alsatian:testcases";
export const TIMEOUT: "alsatian:timeout" = "alsatian:timeout";
