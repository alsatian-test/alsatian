import { TestFixtureResults } from "../../core/results";
import { TestFixtureBuilder } from "./test-fixture-builder";

export class TestFixtureResultsBuilder {
  public build() {
    return new TestFixtureResults(new TestFixtureBuilder().build());
  }
}
