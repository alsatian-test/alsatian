import { Expect, Test } from "alsatian";

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
	passing() {
		Expect(2).toBe(2);
	}
	@Test()
	failing() {
		Expect(2).toBe(3);
	}
}
