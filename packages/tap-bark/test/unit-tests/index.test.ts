import { Test, Expect, SpyOn, Teardown } from "alsatian";
import { TapBark } from "../../src/tap-bark";

export default class IndexTests {
	@Teardown
	private _restoreTapBarkCreate() {
		(TapBark.create as any).restore();
	}

	@Test("process.stdin stream piped to Tap Bark")
	public stdInPipedToTapBark() {
		const chainedPipe = { pipe: () => {} };

		SpyOn(process.stdin, "pipe").andReturn(chainedPipe);

		const fakeTapBarkPipeable = {
			on: () => {},
			once: () => {},
			emit: () => {}
		} as any as NodeJS.WritableStream;

		const fakeTapBark = { getPipeable: () => fakeTapBarkPipeable };

		SpyOn(TapBark, "create").andReturn(fakeTapBark);

		// clear cache for index
		delete require.cache[require.resolve("../../src/cli")];

		// call the index
		require("../../src/cli");

		Expect(process.stdin.pipe).toHaveBeenCalledWith(fakeTapBarkPipeable);
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
		delete require.cache[require.resolve("../../src/cli")];

		// call the index
		require("../../src/cli");

		Expect(chainedPipe.pipe).toHaveBeenCalledWith(process.stdout);
	}
}
