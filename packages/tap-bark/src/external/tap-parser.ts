export interface Assertion {
	id: number;
	ok: boolean;
	name?: string;
	todo?: boolean | string;
	skip?: boolean | string;
	diag?: any;
}

export interface Results {
	ok: boolean;
	count: number;
	pass: number;
	fail?: number;
	skip?: number;
	todo?: number;
	bailout?: boolean;
	plan?: Plan;
	failures: Array<Assertion>;
}

export interface Plan {
	start: number;
	end: number;
	skipAll?: boolean;
	skipReason?: string;
}
