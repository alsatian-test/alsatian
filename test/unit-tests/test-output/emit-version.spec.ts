import { Expect, Test, SpyOn } from "../../../core/alsatian-core";

import { TestOutput } from "../../../core/test-output";

export class EmitVersionTests {

    private static _getDummyStream(): any {
        return {
            write: (data: any) => { }
        };
    }

    @Test()
    public shouldEmitVersion13() {
        let outStream = EmitVersionTests._getDummyStream();
        SpyOn(outStream, "write");

        let errStream = EmitVersionTests._getDummyStream();

        let testOutput = new TestOutput(outStream, errStream);

        testOutput.emitVersion();

        Expect(outStream.write).toHaveBeenCalledWith("TAP version 13\n");
    }

}
