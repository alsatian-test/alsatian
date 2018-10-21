import {
  Test,
  Expect,
  SpyOn,
  Any,
  FunctionSpy,
  TestCase,
  Setup,
  Teardown,
  TestFixture
} from "alsatian";
import { TapBark, TapBarkOutput } from "../../../src/tap-bark";

async function wait(timeInMs: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timeInMs);
  });
}

@TestFixture("tap bark tests")
export default class TapBarkTests {

  @Setup
  private _stubProcessExit() {
    SpyOn(process, "exit").andStub();
  }

  @Teardown
  private _restoreProcessExit() {
    (process.exit as any).restore();
  }

  @Test("plan event handled")
  public parserPlanEventHandled() {
    SpyOn(TapBark.tapParser, "on");

    TapBark.create();

    Expect(TapBark.tapParser.on).toHaveBeenCalledWith("plan", Any(Function));
  }

  @Test("comment event handled")
  public parserCommentEventHandled() {
    SpyOn(TapBark.tapParser, "on");

    TapBark.create();

    Expect(TapBark.tapParser.on).toHaveBeenCalledWith("comment", Any(Function));
  }

  @Test("assert event handled")
  public parserAssertEventHandled() {
    SpyOn(TapBark.tapParser, "on");

    TapBark.create();

    Expect(TapBark.tapParser.on).toHaveBeenCalledWith("assert", Any(Function));
  }

  @Test("complete event handled")
  public parserCompleteEventHandled() {
    SpyOn(TapBark.tapParser, "on");

    TapBark.create();

    Expect(TapBark.tapParser.on).toHaveBeenCalledWith("complete", Any(Function));
  }

  @Test("create makes a new TapBark")
  public createReturnsInstanceOfTapBark() {
    Expect(TapBark.create() instanceof TapBarkOutput).toBe(true);
  }

  @Test("create a new TapBark instance every time")
  public createNewInstanceOfTapBarkEachCall() {
    Expect(TapBark.create()).not.toBe(TapBark.create());
  }

  @Test("create a new pipeable instance every time")
  public createNewInstanceOfPipeableEachCall() {
    const tapBark = TapBark.create();

    Expect(tapBark.getPipeable()).not.toBe(tapBark.getPipeable());
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(42)
  public planEventSetsPlanEndCorrectly(planEnd: number) {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const planEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "plan")[0][1];

    const assertEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "assert")[0][1];

    planEventHandler({ end: planEnd });

    assertEventHandler({ id: 1 });

    Expect(tapBark.setState).toHaveBeenCalledWith(
      Any(Object).thatMatches({
        totalTests: planEnd
      })
    );

    Expect(tapBark.setState).toHaveBeenCalledWith(
      Any(Object).thatMatches({
        currentTest: 1
      })
    );
  }

  @TestCase("")
  @TestCase("Fixture")
  @TestCase("A really, really awesome fixture!")
  public testFixtureCommentSetsFixtureNameCorrectly(fixtureName: string) {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const commentEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "comment")[0][1];

    commentEventHandler("# FIXTURE " + fixtureName);

    Expect(tapBark.setState).toHaveBeenCalledWith(
      Any(Object).thatMatches({
        fixtureName
      })
    );
  }

  @TestCase("#some uninteresting comment")
  @TestCase("# Fixture wrong casing")
  @TestCase("#Fixtureno space")
  public otherCommentsDoNotSetTheFixtureName(comment: string) {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const commentEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "comment")[0][1];

    commentEventHandler(comment);

    Expect(tapBark.setState).not.toHaveBeenCalledWith(
      Any(Object).thatMatches({
        fixtureName: Any
      })
    );
  }

  @TestCase("")
  @TestCase("Test")
  @TestCase("A really, really awesome test name!")
  public assertEventSetsTestNameCorrectly(testName: string) {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const assertEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "assert")[0][1];

    assertEventHandler({ name: testName });

    Expect(tapBark.setState).toHaveBeenCalledWith(
      Any(Object).thatMatches({
        testName
      })
    );
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(42)
  public assertEventSetsProgressCorrectly(testId: number) {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const planEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "plan")[0][1];

    const assertEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "assert")[0][1];

    planEventHandler({ end: 42 });

    assertEventHandler({ id: testId });

    Expect(tapBark.setState).toHaveBeenCalledWith(
      Any(Object).thatMatches({
        currentTest: testId
      })
    );
  }

  @Test()
  public async completeEventResultsOkExitsProcessCodeZero() {
    TapBark.create();

    const completeEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({ ok: true });

    await wait(5);

    Expect(process.exit).toHaveBeenCalledWith(0);
  }

  @Test()
  public async completeEventResultsNotOkExitsProcessCodeOne() {
    TapBark.create();

    const completeEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({ ok: false });

    await wait(5);

    Expect(process.exit).toHaveBeenCalledWith(1);
  }

  @Test()
  public completeEventResultsPassDefaultsToZero() {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const completeEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({});

    Expect(
      ((tapBark.setState as any) as FunctionSpy).calls[0].args[0].results.pass
    ).toBe(0);
  }

  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  public completeEventResultsPassSetToPassOnResults(passCount: number) {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const completeEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({ pass: passCount });

    Expect(
      ((tapBark.setState as any) as FunctionSpy).calls[0].args[0].results.pass
    ).toBe(passCount);
  }

  @Test()
  public completeEventResultsIgnoreDefaultsToZero() {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const completeEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({});

    Expect(
      ((tapBark.setState as any) as FunctionSpy).calls[0].args[0].results.ignore
    ).toBe(0);
  }

  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  public completeEventResultsIgnoreSetToSkipOnResults(skipCount: number) {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const completeEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({ skip: skipCount });

    Expect(
      ((tapBark.setState as any) as FunctionSpy).calls[0].args[0].results.ignore
    ).toBe(skipCount);
  }

  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  public completeEventResultsIgnoreSetToTodoOnResults(todoCount: number) {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const completeEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({ todo: todoCount });

    Expect(
      ((tapBark.setState as any) as FunctionSpy).calls[0].args[0].results.ignore
    ).toBe(todoCount);
  }

  @TestCase(1, 1)
  @TestCase(2, 2)
  @TestCase(42, 3)
  public completeEventResultsIgnoreSetToSkipPlusTodoOnResults(
    skipCount: number,
    todoCount: number
  ) {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const completeEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({ skip: skipCount, todo: todoCount });

    Expect(
      ((tapBark.setState as any) as FunctionSpy).calls[0].args[0].results.ignore
    ).toBe(skipCount + todoCount);
  }

  @Test()
  public completeEventResultsFailDefaultsToZero() {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const completeEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({});

    Expect(
      ((tapBark.setState as any) as FunctionSpy).calls[0].args[0].results.fail
    ).toBe(0);
  }

  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  public completeEventResultsFailSetToFailOnResults(failCount: number) {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const completeEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({ fail: failCount });

    Expect(
      ((tapBark.setState as any) as FunctionSpy).calls[0].args[0].results.fail
    ).toBe(failCount);
  }

  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  public completeEventResultsFailSetToFailuresLengthOnResults(
    failCount: number
  ) {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const completeEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    const failures = [];

    for (let i = 0; i < failCount; i++) {
      failures.push({});
    }

    completeEventHandler({ failures });

    Expect(
      ((tapBark.setState as any) as FunctionSpy).calls[0].args[0].results.fail
    ).toBe(failCount);
  }

  @Test()
  public completeEventResultsFailuresDefaultsToEmptyArray() {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const completeEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({});

    Expect(
      ((tapBark.setState as any) as FunctionSpy).calls[0].args[0].results
        .failures
    ).toEqual([]);
  }

  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  public completeEventResultsFailuresSetToFailuresOnResults(failCount: number) {
    SpyOn(TapBark.tapParser, "on");

    const tapBark = TapBark.create();
    
    SpyOn(tapBark, "setState");

    const completeEventHandler = (TapBark.tapParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    const failures = [];

    for (let i = 0; i < failCount; i++) {
      failures.push({});
    }

    completeEventHandler({ failures });

    Expect(
      ((tapBark.setState as any) as FunctionSpy).calls[0].args[0].results
        .failures
    ).toBe(failures);
  }
}
