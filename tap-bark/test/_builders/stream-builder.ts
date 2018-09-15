import { IStream } from "../../src/stream/stream.i";

export class StreamBuilder {

    public build(): IStream {
        return <IStream> {
            writeLine: (message: string) => { },
            write: (message: string) => { },
            moveCursor: (x: number, y: number) => { },
            cursorTo: (x: number, y: number) => { },
            clearLine: () => { },
            getUnderlyingStream: () => { return <any>{ on: () => {} }; }
        };
    }
}
