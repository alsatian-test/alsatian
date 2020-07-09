import { TreeItem, TreeItemCollapsibleState, Event } from "vscode";
import { join, relative } from "path";
import { ITestFixture, ITest } from "alsatian/dist/core/_interfaces";
import { TestResultEvent, ResultEventType } from "../running/test-runner";
import { TestOutcome } from "alsatian";
import { ITestCompleteEvent } from "alsatian/dist/core/events";

interface IResults {
  results?: Array<ITestCompleteEvent> | null;
  isRunning?: boolean;
}

type ITestWithResults = ITest & IResults;

interface ITestFixtureWithResults extends ITestFixture, IResults {
  tests: Array<ITestWithResults>
}

export class AlsatianTestFixtureTreeViewItem extends TreeItem {
  constructor(
    public readonly fixture: ITestFixtureWithResults,
    public readonly collapsibleState: TreeItemCollapsibleState,
    resultStream: Event<TestResultEvent>
  ) {
    super(fixture?.description || "Fixture Failed to Load", fixture ? collapsibleState : TreeItemCollapsibleState.None);

    if (fixture === undefined) {
      return;
    }

    resultStream(event => {
      if (
         (relative(event.payload.fileName, this.fixture.filePath) !== ""
      || event.payload.fixtureName !== this.fixture.fixture.constructor.name)
      ) {
        return;
      }

      if (event.type === ResultEventType.Started) {
        this.fixture.isRunning = true;
      }
      else if (event.type === ResultEventType.RunCompleted) {
        this.fixture.isRunning = false;
      }

      if (event.type === ResultEventType.TestCompleted && event.payload.testName) {
        this.fixture.tests.find(x => x.key === event.payload.testName)!.results = event.payload.results;
      }
    });
  }

  command = this.fixture ? {
    title: "",
    command: "alsatian.openSpec",
    arguments: [
      this.fixture.filePath
    ]
  } : undefined;

  private get totalTests() {
    return this.fixture?.tests.map(test => test.testCases.length).reduce((total, current) => total + current, 0) || 0;
  }

  private get results(): Array<ITestCompleteEvent> {
    return this.fixture?.tests.map(x => x.results || []).reduce((c, x) => c.concat(x)) || [];
  }

  get tooltip(): string {
    if (this.fixture === undefined) {
      return "An unexpected error was thrown when loading this test fixture";
    }

    const passCount = this.results.filter(result => result.outcome === TestOutcome.Pass).length;
    const failCount = this.results.filter(result => result.outcome === TestOutcome.Fail || result.outcome === TestOutcome.Error).length;
    const skipCount = this.results.filter(result => result.outcome === TestOutcome.Skip).length;
    const notRunCount = this.totalTests - passCount - failCount - skipCount;

    return `Pass: ${passCount}/${this.totalTests}\n`
         + `Fail: ${failCount}/${this.totalTests}\n`
         + `Not Run: ${notRunCount}/${this.totalTests}\n`
         + `Skipped: ${skipCount}/${this.totalTests}`;
  }

  get description(): string {
    return this.fixture ? `(${this.totalTests} tests)` : "";
  }

  private get resultIcon(): string {
    if (this.fixture === undefined) {
      return "failure";
    }

    if (this.fixture.isRunning) {
      return "running";
    }

    if (this.results.length === 0) {
      return "not-run";
    }
    
    if (this.results.every(result => result.outcome === TestOutcome.Pass)) {
      return "success";
    }
    else {
      return "failure";
    }
  }
  
  iconPath = {
    light: join(__filename, "..", "..", "..", "src", "icons", `${this.resultIcon}.svg`),
    dark: join(__filename, "..", "..", "..", "src", "icons", `${this.resultIcon}.svg`)
  };
}
