import { Expect, Test, TestCase } from "alsatian";
import { Stream } from "../../../../src/stream/stream";

export default class StreamUnderlyingStreamTests {

    @TestCase(null)
    @TestCase(undefined)
    @TestCase({})
    @Test("underlying stream can be set")
    public underlyingStreamCanBeSet(expectedStream: NodeJS.WritableStream) {
        const stream = new Stream();

        stream.stream = expectedStream;

        Expect(stream.getUnderlyingStream()).toBe(expectedStream);
    }

    @TestCase(null)
    @TestCase(undefined)
    @TestCase({})
    @Test("stream property can be set")
    public streamPropertyCanBeSet(expectedStream: NodeJS.WritableStream) {
        const stream = new Stream();

        stream.stream = expectedStream;

        Expect(stream.stream).toBe(expectedStream);

    }

    @TestCase(null)
    @TestCase(undefined)
    @TestCase({})
    @Test("underlying stream and stream property are the same")
    public streamPropertyAndUnderlyingStreamAreTheSame(expectedStream: NodeJS.WritableStream) {
        const stream = new Stream();

        stream.stream = expectedStream;

        Expect(stream.getUnderlyingStream()).toBe(stream.stream);
    }
}