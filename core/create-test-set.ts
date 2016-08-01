import { TestSet, TestLoader, FileRequirer, GlobHelper } from "./_core";

export function createTestSet(): TestSet {
  let fileRequirer = new FileRequirer();
  let testLoader = new TestLoader(fileRequirer);
  let globHelper = new GlobHelper();
  return new TestSet(testLoader, globHelper);
}
