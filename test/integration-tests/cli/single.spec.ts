import { Expect, Test } from "alsatian";

export class SingleTest {
  @Test()
  public twoPlusTwoMakeFour() {
    Expect(2 + 2).toBe(4);
  }
}
