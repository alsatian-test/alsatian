// currently typing these values to string as literal causes
// backwards compatibility issues consider replacing when support
// for TypeScript < 2.1 is dropped
// see:  https://github.com/alsatian-test/alsatian/issues/251
// also: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#literal-types-are-inferred-by-default-for-const-variables-and-readonly-properties

const TEST_FIXTURE: string = "alsatian:test-fixture";
const TESTS: string = "alsatian:tests";
const FOCUS: string = "alsatian:focus";
const IGNORE: string = "alsatian:ignore";
const IGNORE_REASON: string = "alsatian:ignore-reason";
const SETUP: string = "alsatian:setup";
const TEARDOWN: string = "alsatian:teardown";
const TEST_CASES: string = "alsatian:testcases";
const TIMEOUT: string = "alsatian:timeout";

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
