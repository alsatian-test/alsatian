import { TreeItem, TreeItemCollapsibleState, Event } from "vscode";
import { join, relative } from "path";
import { ITest, ITestFixture } from "alsatian/dist/core/_interfaces";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import { TestOutcome } from "alsatian";
import { TestResultEvent, ResultEventType } from "../running/test-runner";

export class AlsatianTestTreeViewItem extends TreeItem {
    constructor(
      public readonly fixture: ITestFixture,
      public readonly test: ITest & { results?: ITestCompleteEvent[] | null, isRunning?: boolean },
      public readonly collapsibleState: TreeItemCollapsibleState,
      resultStream: Event<TestResultEvent>
    ) {
      super(test?.description, collapsibleState);

      resultStream(event => {
        if (
           relative(event.payload.fileName, this.fixture.filePath) !== ""
        || event.payload.fixtureName !== this.fixture.fixture.constructor.name
        || (event.payload.testName !== this.test.key
        && event.payload.testName !== undefined)
        ) {
          return;
        }

        this.test.isRunning = event.type === ResultEventType.Started;
      });
    }
  
    command = {
      title: "",
      command: "alsatian.openSpec",
      arguments: [
        this.fixture.filePath,
        this.test.key
      ]
    };

    get results() {
      return this.test.results || [];
    }

    get totalTests() {
      return this.test.testCases.length;
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
      if (this.test.isRunning) {
        return "running";
      }

      if (!this.test.results) {
        return "not-run";
      }
      
      if (this.test.results?.every(x => x.outcome === TestOutcome.Pass)) {
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
