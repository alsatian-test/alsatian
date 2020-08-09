import { TapAssertion } from "tap-parser";

export interface Results {
	ok: boolean;
	pass: number;
	fail: number;
	ignore: number;
	failures: Array<TapAssertion>;
}
