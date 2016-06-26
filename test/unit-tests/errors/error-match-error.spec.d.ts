export declare class ErrorMatchErrorTests {
    noActualErrorShouldGiveCorrectMessage(): void;
    actualErrorThrownWhenNoneExpectedShouldGiveCorrectMessage(): void;
    actualErrorIsNotCorrectTypeGivesCorrectMessage(ActualErrorType: new () => Error, ExpectedErrorType: new () => Error): void;
    actualErrorIsMatchingTypeButShouldntBeGivesCorrectMessage(ErrorType: new () => Error): void;
    actualErrorHasIncorrectMessageGivesCorrectMessage(message: string): void;
    actualErrorHasMatchingMessageButShouldntBeGivesCorrectMessage(message: string): void;
    actualErrorHasIncorrectTypeAndMessageGivesCorrectMessage(ExpectedErrorType: new () => Error, message: string): void;
    actualErrorHasMatchingMessageAndTypeButShouldntBeGivesCorrectMessage(ExpectedErrorType: new (message: string) => Error, message: string): void;
}
