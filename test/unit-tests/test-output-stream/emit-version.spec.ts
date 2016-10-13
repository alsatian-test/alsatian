import { Expect, Test, SpyOn, TestOutputStream } from "../../../core/alsatian-core";

export class EmitVersionTests {

    @Test()
    public shouldEmitVersion13() {
        let testOutput = new TestOutputStream();
        SpyOn(testOutput, "push");

        testOutput.emitVersion();

        Expect(testOutput.push).toHaveBeenCalledWith("TAP version 13\n");
    }

}
