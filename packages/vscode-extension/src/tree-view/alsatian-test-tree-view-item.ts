import { TreeItem, TreeItemCollapsibleState, EventEmitter, Event } from "vscode";
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
        || event.payload.testName !== this.test.key
        ) {
          return;
        }

        this.test.isRunning = event.type === ResultEventType.Started;

        if (event.type === ResultEventType.Completed) {
          this.test.results = event.payload.results;
        }
      });
    }
  
    get tooltip(): string {
      return `${this.label}-tooltip`;
    }
  
    get description(): string {
      return `(${this.test?.testCases.length || 0} tests)`;
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
