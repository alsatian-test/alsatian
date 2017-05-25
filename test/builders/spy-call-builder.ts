import { SpyCall } from "../../core/spying/spy-call";
import { ISpyCall } from "../../core/_interfaces";

export class SpyCallBuilder {

  private args: Array<any>;

  public SpyCallBuilder() {
    this.args = [];
  }

  public withArguments(args: Array<any>): SpyCallBuilder {
    this.args = args;
    return this;
  }

  public build(): ISpyCall {
    return new SpyCall(this.args);
  }

}
