import { Expect, Test, TestCase, SpyOn, FunctionSpy } from "alsatian";
import { Stream } from "../../../../src/stream/stream";
import * as Readline from "readline";

export default class StreamWritingTests {

    @TestCase({})
    @TestCase({ "a": "stream" })
    @TestCase({ "a": "much", "more": [ "complex", "stream" ]})
    @Test("clear line passes inner stream and 0")
    public clearLineCalledWithStreamAndPosition0(expectedStream: NodeJS.WritableStream) {
        const stream = new Stream();

        stream.stream = expectedStream;

        SpyOn(Readline, "clearLine").andStub();

        stream.clearLine();

        Expect(Readline.clearLine).toHaveBeenCalledWith(expectedStream, 0);

        (<any>Readline.clearLine).restore();
    }

    @TestCase({})
    @TestCase({ "a": "stream" })
    @TestCase({ "a": "much", "more": [ "complex", "stream" ]})
    @Test("move cursor acts on inner stream")
    public moveCursorActsOnInnerStream(expectedStream: NodeJS.WritableStream) {
        const stream = new Stream();

        stream.stream = expectedStream;

        SpyOn(Readline, "moveCursor").andStub();

        stream.moveCursor(0, 0);

        Expect(Readline.moveCursor).toHaveBeenCalledWith(expectedStream, 0, 0);

        (<any>Readline.moveCursor).restore();
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(42)
    @Test("cursor moved to correct x position")
    public moveCursorSetsCorrectXPosition(expectedXPosition: number) {
        const stream = new Stream();

        SpyOn(Readline, "moveCursor").andStub();

        stream.moveCursor(expectedXPosition, 0);

        Expect(Readline.moveCursor).toHaveBeenCalledWith(stream.stream, expectedXPosition, 0);

        (<any>Readline.moveCursor).restore();
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(42)
    @Test("cursor moved to correct y position")
    public moveCursorSetsCorrectYPosition(expectedYPosition: number) {
        const stream = new Stream();

        SpyOn(Readline, "moveCursor").andStub();

        stream.moveCursor(0, expectedYPosition);

        Expect(Readline.moveCursor).toHaveBeenCalledWith(stream.stream, 0, expectedYPosition);

        (<any>Readline.moveCursor).restore();
    }

    @TestCase({})
    @TestCase({ "a": "stream" })
    @TestCase({ "a": "much", "more": [ "complex", "stream" ]})
    @Test("cursor to acts on inner stream")
    public cursorToActsOnInnerStream(expectedStream: NodeJS.WritableStream) {
        const stream = new Stream();

        stream.stream = expectedStream;

        SpyOn(Readline, "cursorTo").andStub();

        stream.cursorTo(0, 0);

        Expect(Readline.cursorTo).toHaveBeenCalledWith(expectedStream, 0, 0);

        (<any>Readline.cursorTo).restore();
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(42)
    @Test("cursor to set with correct x position")
    public cursorToSetsCorrectXPosition(expectedXPosition: number) {
        const stream = new Stream();

        SpyOn(Readline, "cursorTo").andStub();

        stream.cursorTo(expectedXPosition, 0);

        Expect(Readline.cursorTo).toHaveBeenCalledWith(stream.stream, expectedXPosition, 0);

        (<any>Readline.cursorTo).restore();
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(42)
    @Test("cursor to set with correct y position")
    public cursorToSetsCorrectYPosition(expectedYPosition: number) {
        const stream = new Stream();

        SpyOn(Readline, "cursorTo").andStub();

        stream.cursorTo(0, expectedYPosition);

        Expect(Readline.cursorTo).toHaveBeenCalledWith(stream.stream, 0, expectedYPosition);

        (<any>Readline.cursorTo).restore();
    }
}