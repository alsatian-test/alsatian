import { IResultWithOutcome } from "./result-with-outcome.i";
import { TestOutcome } from "./test-outcome";

export function getOverallOutcome(results: Array<IResultWithOutcome>) {
  const outcomes = results.map(result => result.outcome);

  if (outcomesContains(outcomes, TestOutcome.Error)) {
    return TestOutcome.Error;
  }

  if (outcomesContains(outcomes, TestOutcome.Fail)) {
    return TestOutcome.Fail;
  }

  if (outcomesContains(outcomes, TestOutcome.Pass)) {
    return TestOutcome.Pass;
  }

  return TestOutcome.Skip;
}

function outcomesContains(outcomes: Array<TestOutcome>, outcome: TestOutcome) {
  return outcomes.some(o => o === outcome);
}
