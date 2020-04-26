import * as vscode from "vscode";
import * as path from "path";
import { TestSet } from "alsatian";
import { AlsatianTestFixtureTreeViewItem } from "./alsatian-test-fixture-tree-view-item";
import { findNearestFile } from "../find-nearest-file";
import { registerTsNode } from "../register-ts-node";
import { AlsatianTestTreeViewItem } from "./alsatian-test-tree-view-item";
import { TestRunner } from "../running/test-runner";

export class AlsatianTestTreeViewDataProvider implements vscode.TreeDataProvider<AlsatianTestFixtureTreeViewItem> {

    public static setup(testRunner: TestRunner) {
        vscode.window.registerTreeDataProvider(
            "alsatianTests",
            new AlsatianTestTreeViewDataProvider(vscode.workspace.rootPath || ".", testRunner)
        );
    }

  private testSet!: TestSet;

  private updateView = new vscode.EventEmitter<AlsatianTestTreeViewItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<AlsatianTestTreeViewItem | undefined> = this.updateView.event;

  constructor(private workspaceRoot: string, private testRunner: TestRunner) {
    this.testRunner.subscribe(() => this.updateView.fire());
  }

  public getTreeItem(element: AlsatianTestFixtureTreeViewItem): vscode.TreeItem {
    return element;
  }

  public async getChildren(element?: AlsatianTestFixtureTreeViewItem): Promise<any[]> {   
    
    if (element) {
      return element.fixture?.tests.map(test => new AlsatianTestTreeViewItem(element.fixture, test, vscode.TreeItemCollapsibleState.None, this.testRunner.subscribe));
    }

    if (this.testSet) {
      return this.testSet.testFixtures.map(fixture => new AlsatianTestFixtureTreeViewItem(fixture, vscode.TreeItemCollapsibleState.Collapsed));
    }

    const configs = await vscode.workspace.findFiles("**/.alsatianrc.json");

    this.testSet = TestSet.create();

    const alsatianConfigPath = configs[0].fsPath;

    const alsatianConfig = await import(alsatianConfigPath);
            
    const root = alsatianConfigPath.split(/[\\/]/);
    root.pop();
    const rootPath = root.join("/");

    await registerTsNode(
        alsatianConfig.tsconfig ?
        path.join(rootPath, alsatianConfig.tsconfig) :
        await findNearestFile("tsconfig.json", alsatianConfigPath)
    );

    const preTestScripts = ((alsatianConfig.preTestScripts || []) as string[]).map(script => path.join(rootPath, script));

    await Promise.all(preTestScripts.map(script => import(script)));

    alsatianConfig.specs.forEach((spec: string) => {      
      this.testSet.addTestsFromFiles(path.join(rootPath, spec));
    });

    return this.testSet.testFixtures.map(fixture => new AlsatianTestFixtureTreeViewItem(fixture, vscode.TreeItemCollapsibleState.Collapsed));
  }
}
