import { TestOutcome } from "alsatian";

export enum MessageType {
    TestComplete = "testComplete",
    RunComplete = "runComplete"
}

export interface IMessage {
    type: MessageType;
    results?: Array<{
        outcome?: TestOutcome,
        error?: { message: string } | null,
        stack?: string
    }>;
}
