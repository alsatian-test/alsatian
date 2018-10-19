import { TestItem } from "../../core/running";
import { TestFixtureBuilder } from "./test-fixture-builder";
import { TestBuilder } from "./test-builder";
import { TestCaseBuilder } from "./test-case-builder";

export class TestItemBuilder {
  public build() {
    return new TestItem(
      new TestFixtureBuilder().build(),
      new TestBuilder().build(),
      new TestCaseBuilder().build()
    );
  }
}
