import * as vscode from "vscode";
import * as path from "path";
import { TestSet } from "alsatian";
import { AlsatianTestFixtureTreeViewItem } from "./alsatian-test-fixture-tree-view-item";
import { findNearestFile } from "../find-nearest-file";
import { registerTsNode } from "../register-ts-node";
import { AlsatianTestTreeViewItem } from "./alsatian-test-tree-view-item";
import { TestRunner } from "../running/test-runner";
import { TestSetTreeViewItem } from "./test-set-tree-view-item";
import { UpdateTreeviewCommand } from "./update-tree-view-command";

type AlsatianTreeViewItem = TestSetTreeViewItem | AlsatianTestFixtureTreeViewItem | AlsatianTestTreeViewItem | vscode.TreeItem;

export class AlsatianTestTreeViewDataProvider implements vscode.TreeDataProvider<AlsatianTreeViewItem> {

    public static setup(context: vscode.ExtensionContext, testRunner: TestRunner) {    
        const treeViewDataProvider = new AlsatianTestTreeViewDataProvider(vscode.workspace.rootPath || ".", testRunner);

        vscode.window.registerTreeDataProvider(
            "alsatianTests",
            treeViewDataProvider
        );

        UpdateTreeviewCommand.setup(context, treeViewDataProvider);
    }

  private testSets!: Array<{ testSet: TestSet, relativePath: string }>;

  private updateView = new vscode.EventEmitter<AlsatianTestTreeViewItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<any | undefined> = this.updateView.event;
  public async refresh() {
    this.testSets = [];
    this.updateView.fire();
    Object.keys(require.cache)
          .forEach(key => delete require.cache[key]);
    await this.loadTestSets();
    this.updateView.fire();
  }

  constructor(private workspaceRoot: string, private testRunner: TestRunner) {
    this.testRunner.subscribe(() => this.updateView.fire());
  }

  public getTreeItem(element: AlsatianTestFixtureTreeViewItem): vscode.TreeItem {
    return element;
  }

  public async getChildren(element?: AlsatianTestFixtureTreeViewItem | TestSetTreeViewItem): Promise<Array<AlsatianTreeViewItem>> {   
    
    if (element) {
      if (element instanceof TestSetTreeViewItem) {
        return element.testSet.testFixtures.map(fixture => new AlsatianTestFixtureTreeViewItem(fixture, vscode.TreeItemCollapsibleState.Collapsed, this.testRunner.subscribe));;
      }

      return element.fixture?.tests.map(test => new AlsatianTestTreeViewItem(element.fixture, test, vscode.TreeItemCollapsibleState.None, this.testRunner.subscribe));
    }

    if (this.testSets) {
      return this.testSets.map(testSet => new TestSetTreeViewItem(testSet.testSet, testSet.relativePath, vscode.TreeItemCollapsibleState.Collapsed));
    }

    return await this.loadTestSets();
  }

  private async loadTestSets() {

    const configs = await vscode.workspace.findFiles("**/.alsatianrc.json");

    if (configs.length === 0) {
      return [ new vscode.TreeItem("No .alsatianrc.json files found") ];
    }

    this.testSets = await Promise.all(configs.map(async config => {
      const alsatianConfigPath = config.fsPath;

      const testSetInfo = {
        relativePath: path.relative(this.workspaceRoot, alsatianConfigPath).replace(/[\\/]\.alsatianrc.json$/, ""),
        testSet: TestSet.create()
      };

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
      
      // needed in case any setup occurs in a constructor
      await Promise.all(preTestScripts.map(script => import(script)));

      //TODO: tests already loaded here and are loaded again in `run.ts` could avoid double load for quicker running
      // depends on solution to updates.
      alsatianConfig.specs.forEach((spec: string) => {      
        testSetInfo.testSet.addTestsFromFiles(path.join(rootPath, spec));
      });

      return testSetInfo;
    }));

    return this.testSets.map(testSet => new TestSetTreeViewItem(testSet.testSet, testSet.relativePath, vscode.TreeItemCollapsibleState.Collapsed));
  }
}
