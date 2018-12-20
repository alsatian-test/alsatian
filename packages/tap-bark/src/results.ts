import { Assertion } from "./external/tap-parser";

export interface Results {
	pass: number;
	fail: number;
	ignore: number;
	failures: Array<Assertion>;
}
