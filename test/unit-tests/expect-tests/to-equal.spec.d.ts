export declare class ToEqualTests {
    identicalSimpleTypesDontThrow(value: any): void;
    matchingSimpleTypesDontThrow(expected: any, actual: any): void;
    differentValuesThrowsExactMatchError(): void;
    differentSimpleValuesToThrow(expected: any, actual: any): void;
    differentSimpleValuesThrowsExactMatchErrorWithCorrectMessage(expected: any, actual: any): void;
    nullAndUndefinedNotToThrow(expected: any, actual: any): void;
    differentSimpleTypesToThrow(expected: any, actual: any): void;
    identicalComplexTypesDontThrow(value: any): void;
    matchingComplexTypesNotThrow(expected: any, actual: any): void;
    differentComplexValuesThrowsExactMatchErrorWithCorrectMessage(expected: any, actual: any): void;
    differentComplexTypesToThrow(expected: any, actual: any): void;
    differentDeepComplexTypesToThrow(expected: any, actual: any): void;
    differentDeepComplexToThrow(expected: any, actual: any): void;
}
