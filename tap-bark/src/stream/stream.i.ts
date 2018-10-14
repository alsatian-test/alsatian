export interface IStream {
  writeLine(message: string): void;
  write(message: string): void;
  moveCursor(x: number, y: number): void;
  cursorTo(x: number, y: number): void;
  clearLine(): void;
  getUnderlyingStream(): NodeJS.WritableStream;
}
