import { FunctionSpy } from "../../core/spying/function-spy";

export class FunctionSpyBuilder {

  public build(): FunctionSpy {
    return new FunctionSpy();
  }

}
