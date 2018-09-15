import { Test, TestCase, Expect, SpyOn, IgnoreTests } from "alsatian";
import { OutputBuilder } from "../../../_builders/output-builder";
import { StreamBuilder } from "../../../_builders/stream-builder";
import { OutputProviderBuilder } from "../../../_builders/output-provider-builder";
import { IResults } from "../../../../src/results.i";
import { ResultType } from "../../../../src/result-type";
import { Assertion } from "../../../../src/external/tap-parser";

export class OutputResultsTests {

    @TestCase(5)
    @TestCase(10)
    public shouldEmitCorrectPassCount(passes: number) {
        let results: IResults = {
            pass: passes,
            fail: 0,
            ignore: 0,
            failures: []
        };

        let stream = new StreamBuilder().build();
        SpyOn(stream, "writeLine");

        let outputProvider = new OutputProviderBuilder().build();
        SpyOn(outputProvider, "getResultMessage").andCall((type: ResultType, resultCount: number, totalCount: number) => {
            if (type === ResultType.PASS) {
                return `p ${resultCount} ${totalCount}`;
            }

            return "";
        });

        let output = new OutputBuilder()
            .withStream(stream)
            .withOutputProvider(outputProvider)
            .build();

        output.outputResults(results);

        Expect(stream.writeLine).toHaveBeenCalledWith(`p ${passes} ${passes}`);
    }

    @TestCase(5)
    @TestCase(10)
    public shouldEmitCorrectFailCount(fails: number) {
        let results: IResults = {
            pass: 0,
            fail: fails,
            ignore: 0,
            failures: []
        };

        let stream = new StreamBuilder().build();
        SpyOn(stream, "writeLine");

        let outputProvider = new OutputProviderBuilder().build();
        SpyOn(outputProvider, "getResultMessage").andCall((type: ResultType, resultCount: number, totalCount: number) => {
            if (type === ResultType.FAIL) {
                return `f ${resultCount} ${totalCount}`;
            }

            return "";
        });

        let output = new OutputBuilder()
            .withStream(stream)
            .withOutputProvider(outputProvider)
            .build();

        output.outputResults(results);

        Expect(stream.writeLine).toHaveBeenCalledWith(`f ${fails} ${fails}`);
    }

    @TestCase(5)
    @TestCase(10)
    public shouldEmitCorrectIgnoreCount(ignores: number) {
        let results: IResults = {
            pass: 0,
            fail: 0,
            ignore: ignores,
            failures: []
        };

        let stream = new StreamBuilder().build();
        SpyOn(stream, "writeLine");

        let outputProvider = new OutputProviderBuilder().build();
        SpyOn(outputProvider, "getResultMessage").andCall((type: ResultType, resultCount: number, totalCount: number) => {
            if (type === ResultType.IGNORE) {
                return `i ${resultCount} ${totalCount}`;
            }

            return "";
        });

        let output = new OutputBuilder()
            .withStream(stream)
            .withOutputProvider(outputProvider)
            .build();

        output.outputResults(results);

        Expect(stream.writeLine).toHaveBeenCalledWith(`i ${ignores} ${ignores}`);
    }

    @Test()
    public shouldEmitCorrectFractions() {
        let results: IResults = {
            pass: 2,
            fail: 3,
            ignore: 4,
            failures: []
        };

        let total = (results.pass + results.fail + results.ignore);

        let stream = new StreamBuilder().build();
        SpyOn(stream, "writeLine");

        let outputProvider = new OutputProviderBuilder().build();
        SpyOn(outputProvider, "getResultMessage").andCall((type: ResultType, resultCount: number, totalCount: number) => {
            return `${type} ${resultCount} ${totalCount}`;
        });

        let output = new OutputBuilder()
            .withStream(stream)
            .withOutputProvider(outputProvider)
            .build();

        output.outputResults(results);

        Expect(stream.writeLine).toHaveBeenCalledWith(`${ResultType.PASS} ${results.pass} ${total}`);
        Expect(stream.writeLine).toHaveBeenCalledWith(`${ResultType.FAIL} ${results.fail} ${total}`);
        Expect(stream.writeLine).toHaveBeenCalledWith(`${ResultType.IGNORE} ${results.ignore} ${total}`);
    }

    @Test()
    public shouldEmitFailureInfo() {
        const failureMessage = "failure failure!!!";

        let results: IResults = {
            pass: 2,
            fail: 3,
            ignore: 4,
            failures: []
        };

        results.failures.push({
            id: 1,
            ok: false,
            name: "Some failing assertion",
            diag: {
                message: "Bla bla bla"
            }
        });

        results.failures.push({
            id: 2,
            ok: false,
            name: "More bla bla bla",
            diag: {
                message: "Boring diagnostics wabababa"
            }
        });

        let stream = new StreamBuilder().build();
        SpyOn(stream, "writeLine");

        let outputProvider = new OutputProviderBuilder().build();
        SpyOn(outputProvider, "getFailureMessage").andReturn(failureMessage);

        let output = new OutputBuilder()
            .withStream(stream)
            .withOutputProvider(outputProvider)
            .build();

        output.outputResults(results);

        Expect(stream.writeLine).toHaveBeenCalledWith(failureMessage);
    }

    @Test()
    public shouldNotThrowIfFailuresIsUndefined() {

        let stream = new StreamBuilder().build();

        let outputProvider = new OutputProviderBuilder().build();

        let output = new OutputBuilder()
            .withStream(stream)
            .withOutputProvider(outputProvider)
            .build();

        Expect(() => output.outputResults(<IResults>{})).not.toThrow();
    }
}
