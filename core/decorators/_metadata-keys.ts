// currently typing these values to string as literal causes
// backwards compatibility issues consider replacing when support
// for TypeScript < 2.1 is dropped
// see:  https://github.com/alsatian-test/alsatian/issues/251
// also: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#literal-types-are-inferred-by-default-for-const-variables-and-readonly-properties

const TEST_FIXTURE: "alsatian:test-fixture" = "alsatian:test-fixture";
const TESTS: "alsatian:tests" = "alsatian:tests";
const FOCUS: "alsatian:focus" = "alsatian:focus";
const IGNORE: "alsatian:ignore" = "alsatian:ignore";
const IGNORE_REASON: "alsatian:ignore-reason" = "alsatian:ignore-reason";
const SETUP: "alsatian:setup" = "alsatian:setup";
const TEARDOWN: "alsatian:teardown" = "alsatian:teardown";
const TEST_CASES: "alsatian:testcases" = "alsatian:testcases";
const TIMEOUT: "alsatian:timeout" = "alsatian:timeout";

export {
    TEST_FIXTURE,
    TESTS,
    FOCUS,
    IGNORE,
    IGNORE_REASON,
    SETUP,
    TEARDOWN,
    TEST_CASES,
    TIMEOUT
};
