/// <reference types="node" />

declare module "tap-parser" {
	import { Transform } from "stream";

	export default class TapParser extends Transform {}

	export interface TapAssertion {
		id: number;
		ok: boolean;
		name?: string;
		todo?: boolean | string;
		skip?: boolean | string;
		diag?: any;
	}

	export interface TapResults {
		ok: boolean;
		count: number;
		pass: number;
		fail?: number;
		skip?: number;
		todo?: number;
		bailout?: boolean;
		plan?: Plan;
		failures: Array<TapAssertion>;
	}

	export interface Plan {
		start: number;
		end: number;
		skipAll?: boolean;
		skipReason?: string;
	}
}
