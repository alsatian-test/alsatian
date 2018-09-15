import { Test, Expect, SpyOn } from "alsatian";
import { StreamBuilder } from "../../../_builders/stream-builder";
import { OutputBuilder } from "../../../_builders/output-builder";

export class OutputSetupTests {

    @Test()
    public shouldPrintTwoNewLines() {
        let stream = new StreamBuilder().build();
        let spy = SpyOn(stream, "writeLine");

        let output = new OutputBuilder()
            .withStream(stream)
            .build();
        output.setup();

        Expect(spy.calls.length).toBe(2);
        Expect(spy.calls[0].args).toEqual([ "" ]);
        Expect(spy.calls[1].args).toEqual([ "" ]);
    }

}
