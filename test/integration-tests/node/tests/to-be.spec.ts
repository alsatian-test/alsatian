import { Expect, Test } from "../../../../core/alsatian-core";

export class ExampleTestFixture {

  @Test()
  public exampleTest() {
    Expect(1 + 1).toBe(2);
  }
}
