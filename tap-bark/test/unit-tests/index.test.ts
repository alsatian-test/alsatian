import { Test, Expect, SpyOn } from "alsatian";
import { TapBark } from "../../src/tap-bark";

export default class IndexTests {

    @Test("process.stdin stream piped to Tap Bark")
    public stdInPipedToTapBark() {

        const chainedPipe = { pipe: () => {} };

        SpyOn(process.stdin, "pipe").andReturn(chainedPipe);

        const fakeTapBarkPipeable = {
            on: () => {},
            once: () => {},
            emit: () => {}
        };

        const fakeTapBark = { getPipeable: () => fakeTapBarkPipeable };

        SpyOn(TapBark, "create").andReturn(fakeTapBark);

        // clear cache for index
        delete require.cache[require.resolve("../../index")];

        // call the index
        require("../../index");

        Expect(process.stdin.pipe).toHaveBeenCalledWith(fakeTapBarkPipeable);

        (<any>TapBark.create).restore();
    }

    @Test("Tap Bark stream piped to process.stdout")
    public tapBarkPipedToStdOut() {

        const chainedPipe = { pipe: () => {} };
        SpyOn(chainedPipe, "pipe");

        SpyOn(process.stdin, "pipe").andReturn(chainedPipe);

        const fakeTapBarkPipeable = {
            on: () => {},
            once: () => {},
            emit: () => {}
        };

        const fakeTapBark = { getPipeable: () => fakeTapBarkPipeable };

        SpyOn(TapBark, "create").andReturn(fakeTapBark);

        // clear cache for index
        delete require.cache[require.resolve("../../index")];

        // call the index
        require("../../index");

        Expect(chainedPipe.pipe).toHaveBeenCalledWith(process.stdout);

        (<any>TapBark.create).restore();
    }
}