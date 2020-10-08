import { Transform } from "stream";
import { createInterface, ReadLineOptions } from "readline";

export class ConsoleOutputManager {
	public static readonly instance: ConsoleOutputManager = new ConsoleOutputManager();
	private originalWriteStdOut: { (buffer: (Uint8Array | string), cb?: (err?: Error) => void): boolean; (str: (Uint8Array | string), encoding?: string, cb?: (err?: Error) => void): boolean };
	private originalWriteStdErr: { (buffer: (Uint8Array | string), cb?: (err?: Error) => void): boolean; (str: (Uint8Array | string), encoding?: string, cb?: (err?: Error) => void): boolean };

	private constructor() {
		this.originalWriteStdOut = process.stdout.write;
		this.originalWriteStdErr = process.stderr.write;
	}

	createConsoleReaderAndRedirectSystemOut() {
		const inoutStream = new Transform({
			transform(chunk, encoding, callback) {
				this.push(chunk);
				callback();
			}
		});

		const readlineOptions: ReadLineOptions = {
			terminal: true,
			crlfDelay: 100,
			removeHistoryDuplicates: false,
			input: inoutStream
		};
		this.redirectConsoleOutput(inoutStream);
		return createInterface(readlineOptions);
	}

	restoreConsoleOutput() {
		process.stdout.write = this.originalWriteStdOut;
		process.stderr.write = this.originalWriteStdErr;
	}

	private redirectConsoleOutput(inoutStream: Transform) {
		const attachToLog = (std: NodeJS.WriteStream) => {

			std.write = (data: Uint8Array | string, enc: ((err?: Error) => void) | undefined | string) => {
				const encoding = this.detectEncoding(enc);
				if (!Buffer.isBuffer(data)) {
					if (typeof data === "string" || data instanceof String) {
						const string: string = <string>data;
						data = Buffer.from(string, encoding);
					}
					if (data instanceof Uint8Array) {
						const array: Uint8Array = <Uint8Array>data;
						inoutStream.push(array, encoding);
					}
				}
				return true;
			};
		};
		attachToLog(process.stdout);
		attachToLog(process.stderr);
	}

	private detectEncoding(enc: ((err?: Error) => void) | string | undefined) {
		let encoding: BufferEncoding;
		if (enc && enc instanceof Error == false) {
			encoding = <BufferEncoding>enc;
		} else {
			encoding = "utf8";
		}
		return encoding;
	}
}
