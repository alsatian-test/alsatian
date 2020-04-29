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

  get tooltip(): string {
    return `${this.label}-tooltip`;
  }

  get description(): string {
    return `(${this.fixture?.tests.length || 0} tests)`;
  }

  private get resultIcon(): string {
    if (this.fixture.isRunning) {
      return "running";
    }

    const results = this.fixture.tests.map((x: any) => x.results || []).reduce((c, x) => c.concat(x));

    if (results.length === 0) {
      return "not-run";
    }
    
    if (results.every((x: any) => x.outcome === TestOutcome.Pass)) {
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
