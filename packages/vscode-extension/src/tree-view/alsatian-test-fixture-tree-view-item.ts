import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { join } from "path";
import { ITestFixture } from "alsatian/dist/core/_interfaces";

export class AlsatianTestFixtureTreeViewItem extends TreeItem {
  constructor(
    public readonly fixture: ITestFixture,
    public readonly collapsibleState: TreeItemCollapsibleState
  ) {
    super(fixture?.description, collapsibleState);
  }

  get tooltip(): string {
    return `${this.label}-tooltip`;
  }

  get description(): string {
    return `(${this.fixture?.tests.length || 0} tests)`;
  }

  iconPath = {
    light: join(__filename, "..", "..", "..", "src", "icons", "success.svg"),
    dark: join(__filename, "..", "..", "..", "src", "icons", "success.svg")
  };
}
