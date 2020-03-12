import { Expect, Test, Timeout } from "alsatian";

export class TestOne {
	@Test()
	failingdalskndlsndlkanalkdsnlksanldskn() {
		Expect({ an: "object" }).toBe({ an: "object" });
	}
	@Test()
	passing() {
		Expect(2).toBe(2);
	}
}

export class TestTwo {
	@Test()
	async passing() {
		Expect(2).toBe(2);
	}
	@Test()
	failing() {
		Expect(2).toBe(4);
	}
}


const wait = (x: number) => new Promise(resolve => setTimeout(resolve, x));