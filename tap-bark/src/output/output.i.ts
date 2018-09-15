import { IResults } from "../results.i";
import { IStream } from "../stream/stream.i";

export interface IOutput {
    setup(): void;
    setFixtureName(name: string): void;
    setTestName(name: string): void;
    setProgress(current: number, total: number): void;
    outputResults(results: IResults): void;
    getStream(): IStream;
}
