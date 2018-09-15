import { Test, TestCase, Expect, SpyOn } from "alsatian";
import { StreamBuilder } from "../../../_builders/stream-builder";
import { OutputProviderBuilder } from "../../../_builders/output-provider-builder";
import { Output } from "../../../../src/output/output";

export default class SetProgressTests {

    @Test()
    public streamCursorStartsByMovingToZeroNegativeOne() {
        const stream = new StreamBuilder().build();
        const outputProvider = new OutputProviderBuilder().build();

        const output = new Output(stream, outputProvider);

        SpyOn(stream, "moveCursor");

        output.setProgress(100, 100);

        Expect(stream.moveCursor).toHaveBeenCalledWith(0, -1);
    }

    @Test()
    public streamCursorClearsLine() {
        const stream = new StreamBuilder().build();
        const outputProvider = new OutputProviderBuilder().build();

        const output = new Output(stream, outputProvider);

        SpyOn(stream, "clearLine");

        output.setProgress(100, 100);

        Expect(stream.clearLine).toHaveBeenCalled();
    }

    @TestCase(0, 1, "|                    |")
    @TestCase(0, 10, "|                    |")
    @TestCase(0, 100, "|                    |")
    @TestCase(1, 1, "|====================|")
    @TestCase(1, 10, "|==                  |")
    @TestCase(1, 100, "|                    |")
    @TestCase(4, 10, "|========            |")
    @TestCase(42, 100, "|========            |")
    @TestCase(10, 10, "|====================|")
    @TestCase(100, 100, "|====================|")
    public streamIsWrittenWithCorrectProgressBar(currentProgress: number, total: number, expectedProgressBar: string) {
        const stream = new StreamBuilder().build();
        const outputProvider = new OutputProviderBuilder().build();

        const output = new Output(stream, outputProvider);

        SpyOn(stream, "write");

        output.setProgress(currentProgress, total);

        Expect(stream.write).toHaveBeenCalledWith(expectedProgressBar);
    }

    @Test()
    public streamCursorMovesToZeroOne() {
        const stream = new StreamBuilder().build();
        const outputProvider = new OutputProviderBuilder().build();

        const output = new Output(stream, outputProvider);

        SpyOn(stream, "moveCursor");

        output.setProgress(100, 100);

        Expect(stream.moveCursor).toHaveBeenCalledWith(0, 1);
    }

    @Test()
    public streamCursorFinishesByPositioningCursorAtZeroUndefined() {
        const stream = new StreamBuilder().build();
        const outputProvider = new OutputProviderBuilder().build();

        const output = new Output(stream, outputProvider);

        SpyOn(stream, "cursorTo");

        output.setProgress(100, 100);

        Expect(stream.cursorTo).toHaveBeenCalledWith(0, undefined);
    }
}