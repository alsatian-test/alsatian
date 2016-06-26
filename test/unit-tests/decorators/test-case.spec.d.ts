import "reflect-metadata";
export declare class TestCaseDecoratorTests {
    testAddedAsMetaData(): void;
    testKeyMetaDataAdded(key: string): void;
    correctTestCountAdded(testCount: number): void;
    noDuplicateTestKeysAdded(testCount: number): void;
    testCasesAddedAsMetaData(): void;
    testCaseArgumentsMetaDataAdded(expectedArguments: Array<any>): void;
    testCaseKeyMetaDataAddedWithCorrectKey(key: string): void;
    testCaseArgumentsAlwaysAddedAsFirstIndex(testCount: number): void;
}
