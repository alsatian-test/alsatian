import { TestSet, TestLoader } from "./_core";

export function createTestSet(): TestSet {
  let testLoader = new TestLoader();
  return new TestSet(testLoader);
}
