import { IOutputProvider } from "../../src/output-provider/output-provider.i";
import { OutputProvider } from "../../src/output-provider/output-provider";

export class OutputProviderBuilder {
  public build(): IOutputProvider {
    return new OutputProvider();
  }
}
