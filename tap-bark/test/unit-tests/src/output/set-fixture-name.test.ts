import { TestCase, Expect, SpyOn } from "alsatian";
import { OutputBuilder } from "../../../_builders/output-builder";
import { StreamBuilder } from "../../../_builders/stream-builder";

export class SetFixtureNameTests {

    @TestCase("Some Test Fixture")
    @TestCase("Another Test Fixture")
    public shouldSetFixtureNameCorrectly(fixtureName: string) {
        // the writing assumes that we are at the bottom of the console
        // it should move the cursor up two, clear the line, write the text and then move back and set the cursor to the start

        // bit ugly, but we need to test that the calls happen in the right order. Not sure this is the best way to test it.
        let moveCursorUpIndex: number = undefined;
        let clearLineIndex: number = undefined;
        let writeIndex: number = undefined;
        let moveCursorDownIndex: number = undefined;
        let cursorToIndex: number = undefined;

        let currentCallIndex = 0;

        let stream = new StreamBuilder().build();
        SpyOn(stream, "moveCursor").andCall((x: number, y: number) => {
            if (x === 0 && y === -3) {
                moveCursorUpIndex = currentCallIndex;
            }

            if (x === 0 && y === 3) {
                moveCursorDownIndex = currentCallIndex;
            }

            currentCallIndex++;
        });

        SpyOn(stream, "clearLine").andCall(() => {
            clearLineIndex = currentCallIndex;
            currentCallIndex++;
        });

        SpyOn(stream, "write").andCall((message: string) => {
            if (message === fixtureName) {
                writeIndex = currentCallIndex;
                currentCallIndex++;
            }
        });

        SpyOn(stream, "cursorTo").andCall((x: number, y: number) => {
            if (x === 0 && y === undefined) {
                cursorToIndex = currentCallIndex;
                currentCallIndex++;
            }
        });

        let output = new OutputBuilder()
            .withStream(stream)
            .build();
        output.setFixtureName(fixtureName);

        // ensure that the correct calls happened in the correct order
        Expect(moveCursorUpIndex).toBe(0);
        Expect(clearLineIndex).toBe(1);
        Expect(writeIndex).toBe(2);
        Expect(moveCursorDownIndex).toBe(3);
        Expect(cursorToIndex).toBe(4);
    }

}
