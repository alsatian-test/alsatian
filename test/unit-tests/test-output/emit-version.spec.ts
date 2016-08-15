import { Expect, Test, SpyOn } from "../../../core/alsatian-core";
import { OutputStreamBuilder } from "../../builders/output-stream-builder";
import { TestOutput } from "../../../core/test-output";

export class EmitVersionTests {

    @Test()
    public shouldEmitVersion13() {
        let outStream = new OutputStreamBuilder().build();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        testOutput.emitVersion();

        Expect(outStream.write).toHaveBeenCalledWith("TAP version 13\n");
    }

}
