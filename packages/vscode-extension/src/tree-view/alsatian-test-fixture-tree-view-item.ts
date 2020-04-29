import { TreeItem, TreeItemCollapsibleState, Event } from "vscode";
import { join, relative } from "path";
import { ITestFixture } from "alsatian/dist/core/_interfaces";
import { TestResultEvent, ResultEventType } from "../running/test-runner";
import { TestOutcome } from "alsatian";
import { ITestCompleteEvent } from "alsatian/dist/core/events";

export class AlsatianTestFixtureTreeViewItem extends TreeItem {
  constructor(
    public readonly fixture: ITestFixture & { results?: ITestCompleteEvent[] | null, isRunning?: boolean },
    public readonly collapsibleState: TreeItemCollapsibleState,
    resultStream: Event<TestResultEvent>
  ) {
    super(fixture?.description, collapsibleState);    

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
        (this.fixture.tests.find(x => x.key === event.payload.testName) as any).results = event.payload.results;
      }
    });
  }

  command = {
    title: "",
    command: "alsatian.openSpec",
    arguments: [
      this.fixture.filePath
    ]
  }

  private get totalTests() {
    return this.fixture.tests.map(test => test.testCases.length).reduce((total, current) => total + current, 0);
  }

  private get results(): Array<ITestCompleteEvent> {
    return this.fixture.tests.map((x: any) => x.results || []).reduce((c, x) => c.concat(x));
  }

  get tooltip(): string {
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
    return `(${this.totalTests} tests)`;
  }

  private get resultIcon(): string {
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
