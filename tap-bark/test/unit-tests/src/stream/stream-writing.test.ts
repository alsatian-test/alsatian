import { Expect, Test, TestCase, SpyOn } from "alsatian";
import { Stream } from "../../../../src/stream/stream";

export default class StreamWritingTests {

    @TestCase("something")
    @TestCase("")
    @TestCase("This is really important!!!")
    @Test("write passes the message to the underlying stream")
    public writePassesMessageToStream(expectedMessage: string) {
        const stream = new Stream();

        SpyOn(stream.stream, "write");

        stream.write(expectedMessage);

        Expect(stream.stream.write).toHaveBeenCalledWith(expectedMessage);
    }

    @TestCase("something")
    @TestCase("")
    @TestCase("This is really important!!!")
    @Test("write line passes the message to the underlying stream with a new line")
    public writeLineAddsANewLine(expectedMessage: string) {
        const stream = new Stream();

        SpyOn(stream.stream, "write");

        stream.writeLine(expectedMessage);

        Expect(stream.stream.write).toHaveBeenCalledWith(expectedMessage + "\n");
    }
}