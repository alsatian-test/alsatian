import { Test, Expect, SpyOn } from "alsatian";
import { StreamBuilder } from "../../../_builders/stream-builder";
import { OutputBuilder } from "../../../_builders/output-builder";

export class OutputSetupTests {
  @Test()
  public shouldPrintTwoNewLines() {
    const stream = new StreamBuilder().build();
    const spy = SpyOn(stream, "writeLine");

    const output = new OutputBuilder().withStream(stream).build();
    output.setup();

    Expect(spy.calls.length).toBe(2);
    Expect(spy.calls[0].args).toEqual([""]);
    Expect(spy.calls[1].args).toEqual([""]);
  }
}
