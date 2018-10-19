import { IOutput } from "../../src/output/output.i";
import { Output } from "../../src/output/output";
import { IStream } from "../../src/stream/stream.i";
import { StreamBuilder } from "./stream-builder";
import { IOutputProvider } from "../../src/output-provider/output-provider.i";
import { OutputProviderBuilder } from "./output-provider-builder";

export class OutputBuilder {
  private _stream: IStream = new StreamBuilder().build();
  private _outputProvider: IOutputProvider = new OutputProviderBuilder().build();

  public build(): IOutput {
    return new Output(this._stream, this._outputProvider);
  }

  public withStream(stream: IStream): OutputBuilder {
    this._stream = stream;
    return this;
  }

  public withOutputProvider(outputProvider: IOutputProvider): OutputBuilder {
    this._outputProvider = outputProvider;
    return this;
  }
}
