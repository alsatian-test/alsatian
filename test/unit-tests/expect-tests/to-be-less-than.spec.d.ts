export declare class ToBeLessThanTests {
    lessThanShouldNotThrowError(value: number, upperLimit: number): void;
    equalShouldThrowError(value: number, upperLimit: number): void;
    greaterThanShouldThrowError(value: number, upperLimit: number): void;
    lessThanShouldThrowWhenExpectedNotLessThan(value: number, upperLimit: number): void;
    equalShouldNotThrowWhenExpectedNotLessThan(value: number, upperLimit: number): void;
    greaterThanShouldNotThrowWhenExpectedNotLessThan(value: number, upperLimit: number): void;
    shouldThrowLessThanMatchErrorWithCorrectMessage(value: number, upperLimit: number): void;
    shouldThrowLessThanMatchErrorWithCorrectNotMessage(value: number, upperLimit: number): void;
}
