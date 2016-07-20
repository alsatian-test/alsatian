import { TestSet, TestLoader, FileRequirer } from "./_core";

export function createTestSet(): TestSet {
   let fileRequirer = new FileRequirer();
  let testLoader = new TestLoader(fileRequirer);
  return new TestSet(testLoader);
}
