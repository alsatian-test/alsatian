import {
	Expect,
	SpyOnProperty,
	Test,
	TestCase
} from "../../../core/alsatian-core";
import { MatchError } from "../../../core/errors";

export class ToHaveBeenSetTests {
	@Test()
	public propertySetPasses() {
		const some = {
			set property(value: any) {}
		};

		const propertySpy = SpyOnProperty(some, "property");

		some.property = "something";

		Expect(() => Expect(propertySpy).toHaveBeenSet()).not.toThrow();
	}

	@Test()
	public propertyNotSetFails() {
		const some = {
			set property(value: any) {}
		};

		const propertySpy = SpyOnProperty(some, "property");

		Expect(() => Expect(propertySpy).toHaveBeenSet()).toThrow();
	}

	@Test()
	public propertyNotSetFailsWithCorrectError() {
		const some = {
			set property(value: any) {}
		};

		const propertySpy = SpyOnProperty(some, "property");

		Expect(() => Expect(propertySpy).toHaveBeenSet()).toThrowError(
			MatchError,
			"Expected property to be set"
		);
	}

	@Test()
	public propertyNotSetPassesWhenShouldNotCall() {
		const some = {
			set property(value: any) {}
		};

		const propertySpy = SpyOnProperty(some, "property");

		Expect(() => Expect(propertySpy).not.toHaveBeenSet()).not.toThrow();
	}

	@Test()
	public propertySetButShouldNotBeThrowsError() {
		const some = {
			set property(value: any) {}
		};

		const propertySpy = SpyOnProperty(some, "property");

		some.property = "something";

		Expect(() => Expect(propertySpy).not.toHaveBeenSet()).toThrow();
	}

	@Test()
	public propertySetButShouldNotBeThrowsCorrectError() {
		const some = {
			set property(value: any) {}
		};

		const propertySpy = SpyOnProperty(some, "property");

		some.property = "something";

		Expect(() => Expect(propertySpy).not.toHaveBeenSet()).toThrowError(
			MatchError,
			"Expected property not to be set"
		);
	}

	@Test()
	public actualValueAndShouldMatchShouldBeSetToPropertyNotSet() {
		const some = {
			set property(value: any) {}
		};

		const propertySpy = SpyOnProperty(some, "property");

		let propertyError: MatchError;

		try {
			Expect(propertySpy).toHaveBeenSet();
		} catch (error) {
			propertyError = error;
		}

		Expect(propertyError).toBeDefined();
		Expect(propertyError).not.toBeNull();
		Expect(propertyError.actual).toBe(propertySpy);
	}

	@Test()
	public actualValueAndShouldNotMatchShouldBeSetToPropertySet() {
		const some = {
			set property(value: any) {}
		};

		const propertySpy = SpyOnProperty(some, "property");

		some.property = "something";

		let propertyError: MatchError;

		try {
			Expect(propertySpy).not.toHaveBeenSet();
		} catch (error) {
			propertyError = error;
		}

		Expect(propertyError).toBeDefined();
		Expect(propertyError).not.toBeNull();
		Expect(propertyError.actual).toBe(propertySpy);
	}

	@Test()
	public expectedValueAndShouldMatchShouldBeSetToPropertyToBeSet() {
		const some = {
			set property(value: any) {}
		};

		const propertySpy = SpyOnProperty(some, "property");

		let propertyError: MatchError;

		try {
			Expect(propertySpy).toHaveBeenSet();
		} catch (error) {
			propertyError = error;
		}

		Expect(propertyError).toBeDefined();
		Expect(propertyError).not.toBeNull();
		Expect(propertyError.expected).toBe("property to have been set");
	}

	@Test()
	public expectedValueAndShouldNotMatchShouldBeSetToFunctionNotToBeCalled() {
		const some = {
			set property(value: any) {}
		};

		const propertySpy = SpyOnProperty(some, "property");

		some.property = "something";

		let propertyError: MatchError;

		try {
			Expect(propertySpy).not.toHaveBeenSet();
		} catch (error) {
			propertyError = error;
		}

		Expect(propertyError).toBeDefined();
		Expect(propertyError).not.toBeNull();
		Expect(propertyError.expected).toBe("property not to have been set");
	}
}
