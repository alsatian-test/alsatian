import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { TestSet } from "alsatian";

export class TestSetTreeViewItem extends TreeItem {
  constructor(
    public readonly testSet: TestSet,
    private readonly path: string,
    public readonly collapsibleState: TreeItemCollapsibleState
  ) {
    super("Test Set", collapsibleState);
  }

  get description(): string {
    return `(${this.path})`;
  }
}
