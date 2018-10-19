import { Assertion } from "./external/tap-parser";

export interface IResults {
  pass: number;
  fail: number;
  ignore: number;
  failures: Array<Assertion>;
}
