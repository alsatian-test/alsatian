/* tslint:disable:no-unused-expression */

import {
	Expect,
	SpyOn,
	Test,
	TestCase
} from "../../../core/alsatian-core";
import { MatchError } from "../../../core/errors";

export class ToHaveBeenCalledTests {
	@Test()
	public functionCalledPasses() {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		some.function();

		Expect(() => Expect(some.function).toHaveBeenCalled()).not.toThrow();
	}

	@Test()
	public functionNotCalledFails() {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		Expect(() => Expect(some.function).toHaveBeenCalled()).toThrow();
	}

	@Test()
	public functionNotCalledFailsWithCorrectError() {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		Expect(() => Expect(some.function).toHaveBeenCalled()).toThrowError(
			MatchError,
			"Expected function to be called."
		);
	}

	@Test()
	public functionNotCalledPassesWhenShouldNotCall() {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		Expect(() =>
			Expect(some.function).not.toHaveBeenCalled()
		).not.toThrow();
	}

	@Test()
	public functionThrowsErrorFailsWhenShouldNotThrow() {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		some.function();

		Expect(() => Expect(some.function).not.toHaveBeenCalled()).toThrow();
	}

	@Test()
	public functionThrowsErrorFailsWithCorrectError() {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		some.function();

		Expect(() => Expect(some.function).not.toHaveBeenCalled()).toThrowError(
			MatchError,
			"Expected function not to be called."
		);
	}

	@TestCase(undefined)
	@TestCase(null)
	@TestCase(0)
	@TestCase(1)
	@TestCase(42)
	@TestCase({})
	@TestCase({ an: "object" })
	@TestCase([])
	@TestCase(["an", "array"])
	@TestCase(() => {})
	@TestCase((thisCouldBe: any) => "function")
	public checkingWhetherNonFunctionSpyOrSpiedOnFunctionHasBeenCalledShouldThrow(
		actualValue: any
	) {
		const EXPECT = Expect(() => {});
		(EXPECT as any)._actualValue = actualValue;

		Expect(() => EXPECT.toHaveBeenCalled()).toThrowError(
			TypeError,
			"toHaveBeenCalled requires value passed in to Expect to be a FunctionSpy or a spied on function."
		);
	}

	@TestCase(undefined)
	@TestCase(null)
	@TestCase(0)
	@TestCase(1)
	@TestCase(42)
	@TestCase({})
	@TestCase({ an: "object" })
	@TestCase([])
	@TestCase(["an", "array"])
	@TestCase(() => {})
	@TestCase((thisCouldBe: any) => "function")
	public checkingWhetherNonFunctionSpyOrSpiedOnFunctionHasNotBeenCalledShouldThrow(
		actualValue: any
	) {
		const EXPECT = Expect(() => {});
		(EXPECT as any)._actualValue = actualValue;

		Expect(() => EXPECT.not.toHaveBeenCalled()).toThrowError(
			TypeError,
			"toHaveBeenCalled requires value passed in to Expect to be a FunctionSpy or a spied on function."
		);
	}

	@Test()
	public actualValueAndShouldMatchShouldBeSetToFunctionWasNotCalled() {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		let functionError: MatchError;

		try {
			Expect(some.function).toHaveBeenCalled();
		} catch (error) {
			functionError = error;
		}

		Expect(functionError).toBeDefined();
		Expect(functionError).not.toBeNull();
		Expect(functionError.actual).toBe("function was not called.");
	}

	@Test()
	public actualValueAndShouldNotMatchShouldBeSetToFunctionWasCalled() {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		some.function();

		let functionError: MatchError;

		try {
			Expect(some.function).not.toHaveBeenCalled();
		} catch (error) {
			functionError = error;
		}

		Expect(functionError).toBeDefined();
		Expect(functionError).not.toBeNull();
		Expect(functionError.actual).toBe("function was called.");
	}

	@Test()
	public expectedValueAndShouldMatchShouldBeSetToFunctionToBeCalled() {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		let functionError: MatchError;

		try {
			Expect(some.function).toHaveBeenCalled();
		} catch (error) {
			functionError = error;
		}

		Expect(functionError).toBeDefined();
		Expect(functionError).not.toBeNull();
		Expect(functionError.expected).toBe("function to be called");
	}

	@Test()
	public expectedValueAndShouldNotMatchShouldBeSetToFunctionNotToBeCalled() {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		some.function();

		let functionError: MatchError;

		try {
			Expect(some.function).not.toHaveBeenCalled();
		} catch (error) {
			functionError = error;
		}

		Expect(functionError).toBeDefined();
		Expect(functionError).not.toBeNull();
		Expect(functionError.expected).toBe("function not to be called");
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public spyCalledCorrectAmountOfTimesDoesNotThrow(callCount: number) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < callCount; i++) {
			some.function();
		}

		Expect(
			() =>
				Expect(some.function)
					.toHaveBeenCalled()
					.exactly(callCount).times
		).not.toThrow();
	}

	@TestCase(1, 2)
	@TestCase(2, 42)
	@TestCase(42, 1)
	public spyCalledCorrectAmountOfTimesThrowsCorrectError(
		expectedCallCount: number,
		actualCallCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < actualCallCount; i++) {
			some.function();
		}

		if (expectedCallCount === 1) {
			Expect(
				() =>
					Expect(some.function)
						.toHaveBeenCalled()
						.exactly(expectedCallCount).times
			).toThrowError(
				MatchError,
				`Expected function to be called ${expectedCallCount} time.`
			);
		} else {
			Expect(
				() =>
					Expect(some.function)
						.toHaveBeenCalled()
						.exactly(expectedCallCount).times
			).toThrowError(
				MatchError,
				`Expected function to be called ${expectedCallCount} times.`
			);
		}
	}

	@TestCase(1, 2)
	@TestCase(2, 42)
	@TestCase(42, 1)
	public spyCalledCorrectAmountOfTimesThrowsCorrectErrorExpectedValue(
		expectedCallCount: number,
		actualCallCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < actualCallCount; i++) {
			some.function();
		}

		let functionError: MatchError;

		try {
			Expect(some.function)
				.toHaveBeenCalled()
				.exactly(expectedCallCount).times;
		} catch (error) {
			functionError = error;
		}

		Expect(functionError).toBeDefined();
		Expect(functionError).not.toBeNull();

		if (expectedCallCount === 1) {
			Expect(functionError.expected).toBe(
				"function to be called " + expectedCallCount + " time."
			);
		} else {
			Expect(functionError.expected).toBe(
				"function to be called " + expectedCallCount + " times."
			);
		}
	}

	@TestCase(1, 2)
	@TestCase(2, 42)
	@TestCase(42, 1)
	public spyCalledCorrectAmountOfTimesThrowsCorrectErrorActualValue(
		expectedCallCount: number,
		actualCallCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < actualCallCount; i++) {
			some.function();
		}

		let functionError: MatchError;

		try {
			Expect(some.function)
				.toHaveBeenCalled()
				.exactly(expectedCallCount).times;
		} catch (error) {
			functionError = error;
		}

		Expect(functionError).toBeDefined();
		Expect(functionError).not.toBeNull();

		if (actualCallCount === 1) {
			Expect(functionError.actual).toBe(
				"function was called " + actualCallCount + " time."
			);
		} else {
			Expect(functionError.actual).toBe(
				"function was called " + actualCallCount + " times."
			);
		}
	}

	@TestCase(1, 2)
	@TestCase(2, 42)
	@TestCase(42, 1)
	public spyNotCalledCorrectAmountOfTimesDoesNotThrow(
		expectedCallCount: number,
		actualCallCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < actualCallCount; i++) {
			some.function();
		}

		Expect(
			() =>
				Expect(some.function)
					.toHaveBeenCalled()
					.anythingBut(expectedCallCount).times
		).not.toThrow();
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public spyCalledCorrectAmountOfTimesButShouldNotThrowsCorrectError(
		callCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < callCount; i++) {
			some.function();
		}

		if (callCount === 1) {
			Expect(
				() =>
					Expect(some.function)
						.toHaveBeenCalled()
						.anythingBut(callCount).times
			).toThrowError(
				MatchError,
				"Expected function not to be called " + callCount + " time."
			);
		} else {
			Expect(
				() =>
					Expect(some.function)
						.toHaveBeenCalled()
						.anythingBut(callCount).times
			).toThrowError(
				MatchError,
				"Expected function not to be called " + callCount + " times."
			);
		}
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public spyCalledCorrectAmountOfTimesButShouldNotThrowsCorrectErrorExpectedValue(
		callCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < callCount; i++) {
			some.function();
		}

		let functionError: MatchError;

		try {
			Expect(some.function)
				.toHaveBeenCalled()
				.anythingBut(callCount).times;
		} catch (error) {
			functionError = error;
		}

		Expect(functionError).toBeDefined();
		Expect(functionError).not.toBeNull();

		if (callCount === 1) {
			Expect(functionError.expected).toBe(
				"function not to be called " + callCount + " time."
			);
		} else {
			Expect(functionError.expected).toBe(
				"function not to be called " + callCount + " times."
			);
		}
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public spyCalledCorrectAmountOfTimesButShouldNotThrowsCorrectErrorActualValue(
		callCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < callCount; i++) {
			some.function();
		}

		let functionError: MatchError;

		try {
			Expect(some.function)
				.toHaveBeenCalled()
				.anythingBut(callCount).times;
		} catch (error) {
			functionError = error;
		}

		Expect(functionError).toBeDefined();
		Expect(functionError).not.toBeNull();

		if (callCount === 1) {
			Expect(functionError.actual).toBe(
				"function was called " + callCount + " time."
			);
		} else {
			Expect(functionError.actual).toBe(
				"function was called " + callCount + " times."
			);
		}
	}

	@TestCase(1, 2)
	@TestCase(2, 42)
	@TestCase(42, 50)
	public spyCalledGreaterThanMinimumTimesDoesNotThrow(
		minimumCallCount: number,
		actualCallCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < actualCallCount; i++) {
			some.function();
		}

		Expect(
			() =>
				Expect(some.function)
					.toHaveBeenCalled()
					.greaterThan(minimumCallCount).times
		).not.toThrow();
	}

	@TestCase(1, 1)
	@TestCase(2, 1)
	@TestCase(42, 13)
	public spyCalledNotGreaterThanMinimumTimesThrowsCorrectError(
		minimumCallCount: number,
		actualCallCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < actualCallCount; i++) {
			some.function();
		}

		if (minimumCallCount === 1) {
			Expect(
				() =>
					Expect(some.function)
						.toHaveBeenCalled()
						.greaterThan(minimumCallCount).times
			).toThrowError(
				MatchError,
				"Expected function to be called greater than " +
					minimumCallCount +
					" time."
			);
		} else {
			Expect(
				() =>
					Expect(some.function)
						.toHaveBeenCalled()
						.greaterThan(minimumCallCount).times
			).toThrowError(
				MatchError,
				"Expected function to be called greater than " +
					minimumCallCount +
					" times."
			);
		}
	}

	@TestCase(1, 1)
	@TestCase(2, 1)
	@TestCase(42, 13)
	public spyCalledNotGreaterThanMinimumTimesThrowsCorrectErrorExpectedValue(
		minimumCallCount: number,
		actualCallCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < actualCallCount; i++) {
			some.function();
		}

		let functionError: MatchError;

		try {
			Expect(some.function)
				.toHaveBeenCalled()
				.greaterThan(minimumCallCount).times;
		} catch (error) {
			functionError = error;
		}

		Expect(functionError).toBeDefined();
		Expect(functionError).not.toBeNull();

		if (minimumCallCount === 1) {
			Expect(functionError.expected).toBe(
				"function to be called greater than " +
					minimumCallCount +
					" time."
			);
		} else {
			Expect(functionError.expected).toBe(
				"function to be called greater than " +
					minimumCallCount +
					" times."
			);
		}
	}

	@TestCase(1, 1)
	@TestCase(2, 1)
	@TestCase(42, 13)
	public spyCalledNotGreaterThanMinimumTimesThrowsCorrectErrorActualValue(
		minimumCallCount: number,
		actualCallCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < actualCallCount; i++) {
			some.function();
		}

		let functionError: MatchError;

		try {
			Expect(some.function)
				.toHaveBeenCalled()
				.greaterThan(minimumCallCount).times;
		} catch (error) {
			functionError = error;
		}

		Expect(functionError).toBeDefined();
		Expect(functionError).not.toBeNull();

		if (actualCallCount === 1) {
			Expect(functionError.actual).toBe(
				"function was called " + actualCallCount + " time."
			);
		} else {
			Expect(functionError.actual).toBe(
				"function was called " + actualCallCount + " times."
			);
		}
	}

	@TestCase(2, 1)
	@TestCase(42, 13)
	public spyNotCalledLessThanMaximumTimesDoesNotThrow(
		maximumCallCount: number,
		actualCallCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < actualCallCount; i++) {
			some.function();
		}

		Expect(
			() =>
				Expect(some.function)
					.toHaveBeenCalled()
					.lessThan(maximumCallCount).times
		).not.toThrow();
	}

	@TestCase(1, 1)
	@TestCase(2, 3)
	@TestCase(42, 50)
	public spyCalledGreaterThanMaximumTimesButShouldNotThrowsCorrectError(
		maximumCallCount: number,
		actualCallCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < actualCallCount; i++) {
			some.function();
		}

		if (maximumCallCount === 1) {
			Expect(
				() =>
					Expect(some.function)
						.toHaveBeenCalled()
						.lessThan(maximumCallCount).times
			).toThrowError(
				MatchError,
				"Expected function to be called less than " +
					maximumCallCount +
					" time."
			);
		} else {
			Expect(
				() =>
					Expect(some.function)
						.toHaveBeenCalled()
						.lessThan(maximumCallCount).times
			).toThrowError(
				MatchError,
				"Expected function to be called less than " +
					maximumCallCount +
					" times."
			);
		}
	}

	@TestCase(1, 1)
	@TestCase(2, 3)
	@TestCase(42, 50)
	public spyCalledGreaterThanMaximumTimesButShouldNotThrowsCorrectErrorExpectedValue(
		maximumCallCount: number,
		actualCallCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < actualCallCount; i++) {
			some.function();
		}

		let functionError: MatchError;

		try {
			Expect(some.function)
				.toHaveBeenCalled()
				.lessThan(maximumCallCount).times;
		} catch (error) {
			functionError = error;
		}

		Expect(functionError).toBeDefined();
		Expect(functionError).not.toBeNull();

		if (maximumCallCount === 1) {
			Expect(functionError.expected).toBe(
				"function to be called less than " + maximumCallCount + " time."
			);
		} else {
			Expect(functionError.expected).toBe(
				"function to be called less than " +
					maximumCallCount +
					" times."
			);
		}
	}

	@TestCase(1, 1)
	@TestCase(2, 3)
	@TestCase(42, 50)
	public spyCalledGreaterThanMaximumTimesButShouldNotThrowsCorrectErrorActualValue(
		maximumCallCount: number,
		actualCallCount: number
	) {
		const some = {
			function: () => {}
		};

		SpyOn(some, "function");

		for (let i = 0; i < actualCallCount; i++) {
			some.function();
		}

		let functionError: MatchError;

		try {
			Expect(some.function)
				.toHaveBeenCalled()
				.lessThan(maximumCallCount).times;
		} catch (error) {
			functionError = error;
		}

		Expect(functionError).toBeDefined();
		Expect(functionError).not.toBeNull();

		if (actualCallCount === 1) {
			Expect(functionError.actual).toBe(
				"function was called " + actualCallCount + " time."
			);
		} else {
			Expect(functionError.actual).toBe(
				"function was called " + actualCallCount + " times."
			);
		}
	}
}
