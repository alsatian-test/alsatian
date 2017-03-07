import { Expect, Test, TestCase, TestFixture } from "../../../core/alsatian-core";

@TestFixture("temporary tests to satisfy TypeScript quirk")
export class TempTests {

    private _setErrorMessage () {}

    @TestCase("contents-match-error", "ContentsMatchError")
    @TestCase("empty-match-error", "EmptyMatchError")
    @TestCase("error-match-error", "ErrorMatchError")
    @TestCase("equal-match-error", "EqualMatchError")
    @TestCase("exact-match-error", "ExactMatchError")
    @TestCase("function-call-count-match-error", "FunctionCallCountMatchError")
    @TestCase("function-call-match-error", "FunctionCallMatchError")
    @TestCase("greater-than-match-error", "GreaterThanMatchError")
    @TestCase("less-than-match-error", "LessThanMatchError")
    @TestCase("property-set-match-error", "PropertySetMatchError")
    @TestCase("regex-match-error", "RegexMatchError")
    @TestCase("test-timeout-error", "TestTimeoutError")
    @TestCase("truthy-match-error", "TruthyMatchError")
    @Test("give all those errors a go without a super")
    public testErrors(error: string, className: string) {
        let mockMatch: any = {
            MatchError: () => {}
        };

        const mock = require("mock-require");

        mock("../../../core/errors/match-error", mockMatch);
        delete require.cache[require.resolve(`../../../core/errors/${error}.js`)];

        const errorModule = require(`../../../core/errors/${error}`);

        Expect(errorModule[className].call({
            _setErrorMessage: () => {}
        }, {
            calls: [],
            setCalls: []
        })).toBeDefined();

        mock.stopAll();
        delete require.cache[require.resolve(`../../../core/errors/${error}.js`)];
    }
}
