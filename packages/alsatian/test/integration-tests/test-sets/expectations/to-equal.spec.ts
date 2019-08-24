import { Expect, Test } from "alsatian";

export class ToEqualTests {
	@Test()
	public onObjectWithNumericDifference() {
		const expected = {
			price: 160
		};

		const result = {
			price: 159.99999999999997
		};

		Expect(result).toEqual(expected);
	}
}
