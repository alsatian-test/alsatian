import { TestCase, Expect } from "alsatian";
import { Output } from "../../../../src/output/output";
import { IStream } from "../../../../src/stream/stream.i";
import { IOutputProvider } from "../../../../src/output-provider/output-provider.i";

export default class GetStreamTests {
  @TestCase({})
  @TestCase({ a: "stream" })
  @TestCase({ a: "far", more: { complex: "stream" } })
  public returnsSameStreamAsInjected(expectedStream: IStream) {
    const output = new Output(expectedStream, {} as IOutputProvider);

    Expect(output.getStream()).toBe(expectedStream);
  }
}
