import { MatchError } from "../errors";
import { TestOutcome } from "./test-outcome";
import { IResultWithOutcome } from "./result-with-outcome.i";
import { TestResults } from "./test-results";
import { stringify } from "../stringification";

export class TestCaseResult implements IResultWithOutcome {
  public constructor(
    public readonly testResults: TestResults,
    public readonly args: Array<any>,
    public readonly error: Error | null = null
  ) {}

  public get outcome(): TestOutcome {
    if (this.error) {
      if (this.error instanceof MatchError) {
        return TestOutcome.Fail;
      }

      return TestOutcome.Error;
    }

    if (this.testResults.test.ignored) {
      return TestOutcome.Skip;
    }

    return TestOutcome.Pass;
  }

  public get description() {
    const fixture = this.testResults.fixtureResult.fixture;
    const test = this.testResults.test;
    const title = `${fixture.description} > ${test.description}`;

    if (this.args.length === 0) {
      return title;
    }

    const formattedArguments = this.args.map(stringify).join(", ");

    return `${title} ( ${formattedArguments} )`;
  }
}
