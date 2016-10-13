import { Expect, Test, SpyOn, TestOutputStream } from "../../../core/alsatian-core";
import { OutputStreamBuilder } from "../../builders/output-stream-builder";

export class EmitVersionTests {

    @Test()
    public shouldEmitVersion13() {
        let outStream = new OutputStreamBuilder().build();
        SpyOn(outStream, "write");

        let testOutput = new TestOutputStream();

        testOutput.emitVersion();

        Expect(outStream.write).toHaveBeenCalledWith("TAP version 13\n");
    }

}
