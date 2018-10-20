import {
  Test,
  Expect,
  SpyOn,
  Any,
  FunctionSpy,
  TestCase,
  Setup,
  Teardown
} from "alsatian";
import { TapBark } from "../../../src/tap-bark";
const parser = require("tap-parser");
const duplexer = require("duplexer");

export default class TapBarkTests {

  @Test("plan event handled")
  public parserPlanEventHandled() {
    const mockOutput = new OutputBuilder().build();

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    Expect(mockParser.on).toHaveBeenCalledWith("plan", Any(Function));
  }

  @Test("comment event handled")
  public parserCommentEventHandled() {
    const mockOutput = new OutputBuilder().build();

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    Expect(mockParser.on).toHaveBeenCalledWith("comment", Any(Function));
  }

  @Test("assert event handled")
  public parserAssertEventHandled() {
    const mockOutput = new OutputBuilder().build();

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    Expect(mockParser.on).toHaveBeenCalledWith("assert", Any(Function));
  }

  @Test("complete event handled")
  public parserCompleteEventHandled() {
    const mockOutput = new OutputBuilder().build();

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    Expect(mockParser.on).toHaveBeenCalledWith("complete", Any(Function));
  }

  @Test("create makes a new TapBark")
  public createReturnsInstanceOfTapBark() {
    Expect(TapBark.create() instanceof TapBark).toBe(true);
  }

  @Test("create a new TapBark instance every time")
  public createNewInstanceOfTapBarkEachCall() {
    Expect(TapBark.create()).not.toBe(TapBark.create());
  }

  @Test("create a new pipeable instance every time")
  public createNewInstanceOfPipeableEachCall() {
    const mockOutput = new OutputBuilder().build();

    const mockParser = parser();

    const tapBark = new TapBark(mockOutput, mockParser);

    Expect(tapBark.getPipeable()).not.toBe(tapBark.getPipeable());
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(42)
  public planEventSetsPlanEndCorrectly(planEnd: number) {
    const mockOutput = new OutputBuilder().build();

    SpyOn(mockOutput, "setProgress");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const planEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "plan")[0][1];

    const assertEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "assert")[0][1];

    planEventHandler({ end: planEnd });

    assertEventHandler({ id: 1 });

    Expect(mockOutput.setProgress).toHaveBeenCalledWith(1, planEnd);
  }

  @TestCase("")
  @TestCase("Fixture")
  @TestCase("A really, really awesome fixture!")
  public testFixtureCommentSetsFixtureNameCorrectly(fixtureName: string) {
    const mockOutput = new OutputBuilder().build();

    SpyOn(mockOutput, "setFixtureName");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const commentEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "comment")[0][1];

    commentEventHandler("# FIXTURE " + fixtureName);

    Expect(mockOutput.setFixtureName).toHaveBeenCalledWith(fixtureName);
  }

  @TestCase("#some uninteresting comment")
  @TestCase("# Fixture wrong casing")
  @TestCase("#Fixtureno space")
  public otherCommentsDoNotSetTheFixtureName(comment: string) {
    const mockOutput = new OutputBuilder().build();

    SpyOn(mockOutput, "setFixtureName");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const commentEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "comment")[0][1];

    commentEventHandler(comment);

    Expect(mockOutput.setFixtureName).not.toHaveBeenCalled();
  }

  @TestCase("")
  @TestCase("Test")
  @TestCase("A really, really awesome test name!")
  public assertEventSetsTestNameCorrectly(testName: string) {
    const mockOutput = new OutputBuilder().build();

    SpyOn(mockOutput, "setTestName");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const assertEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "assert")[0][1];

    assertEventHandler({ name: testName });

    Expect(mockOutput.setTestName).toHaveBeenCalledWith(testName);
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(42)
  public assertEventSetsProgressCorrectly(testId: number) {
    const mockOutput = new OutputBuilder().build();

    SpyOn(mockOutput, "setProgress");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const planEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "plan")[0][1];

    const assertEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "assert")[0][1];

    planEventHandler({ end: 42 });

    assertEventHandler({ id: testId });

    Expect(mockOutput.setProgress).toHaveBeenCalledWith(testId, 42);
  }

  @Test()
  public completeEventResultsOkExitsProcessCodeZero() {
    const mockOutput = new OutputBuilder().build();

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const completeEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({ ok: true });

    Expect(process.exit).toHaveBeenCalledWith(0);
  }

  @Test()
  public completeEventResultsNotOkExitsProcessCodeOne() {
    const mockOutput = new OutputBuilder().build();

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const completeEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({ ok: false });

    Expect(process.exit).toHaveBeenCalledWith(1);
  }

  @Test()
  public completeEventResultsPassDefaultsToZero() {
    const mockOutput = new OutputBuilder().build();
    SpyOn(mockOutput, "outputResults");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const completeEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({});

    Expect(
      ((mockOutput.outputResults as any) as FunctionSpy).calls[0].args[0].pass
    ).toBe(0);
  }

  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  public completeEventResultsPassSetToPassOnResults(passCount: number) {
    const mockOutput = new OutputBuilder().build();
    SpyOn(mockOutput, "outputResults");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const completeEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({ pass: passCount });

    Expect(
      ((mockOutput.outputResults as any) as FunctionSpy).calls[0].args[0].pass
    ).toBe(passCount);
  }

  @Test()
  public completeEventResultsIgnoreDefaultsToZero() {
    const mockOutput = new OutputBuilder().build();
    SpyOn(mockOutput, "outputResults");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const completeEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({});

    Expect(
      ((mockOutput.outputResults as any) as FunctionSpy).calls[0].args[0].ignore
    ).toBe(0);
  }

  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  public completeEventResultsIgnoreSetToSkipOnResults(skipCount: number) {
    const mockOutput = new OutputBuilder().build();
    SpyOn(mockOutput, "outputResults");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const completeEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({ skip: skipCount });

    Expect(
      ((mockOutput.outputResults as any) as FunctionSpy).calls[0].args[0].ignore
    ).toBe(skipCount);
  }

  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  public completeEventResultsIgnoreSetToTodoOnResults(todoCount: number) {
    const mockOutput = new OutputBuilder().build();
    SpyOn(mockOutput, "outputResults");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const completeEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({ todo: todoCount });

    Expect(
      ((mockOutput.outputResults as any) as FunctionSpy).calls[0].args[0].ignore
    ).toBe(todoCount);
  }

  @TestCase(1, 1)
  @TestCase(2, 2)
  @TestCase(42, 3)
  public completeEventResultsIgnoreSetToSkipPlusTodoOnResults(
    skipCount: number,
    todoCount: number
  ) {
    const mockOutput = new OutputBuilder().build();
    SpyOn(mockOutput, "outputResults");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const completeEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({ skip: skipCount, todo: todoCount });

    Expect(
      ((mockOutput.outputResults as any) as FunctionSpy).calls[0].args[0].ignore
    ).toBe(skipCount + todoCount);
  }

  @Test()
  public completeEventResultsFailDefaultsToZero() {
    const mockOutput = new OutputBuilder().build();
    SpyOn(mockOutput, "outputResults");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const completeEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({});

    Expect(
      ((mockOutput.outputResults as any) as FunctionSpy).calls[0].args[0].fail
    ).toBe(0);
  }

  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  public completeEventResultsFailSetToFailOnResults(failCount: number) {
    const mockOutput = new OutputBuilder().build();
    SpyOn(mockOutput, "outputResults");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const completeEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({ fail: failCount });

    Expect(
      ((mockOutput.outputResults as any) as FunctionSpy).calls[0].args[0].fail
    ).toBe(failCount);
  }

  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  public completeEventResultsFailSetToFailuresLengthOnResults(
    failCount: number
  ) {
    const mockOutput = new OutputBuilder().build();
    SpyOn(mockOutput, "outputResults");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const completeEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    const failures = [];

    for (let i = 0; i < failCount; i++) {
      failures.push({});
    }

    completeEventHandler({ failures });

    Expect(
      ((mockOutput.outputResults as any) as FunctionSpy).calls[0].args[0].fail
    ).toBe(failCount);
  }

  @Test()
  public completeEventResultsFailuresDefaultsToEmptyArray() {
    const mockOutput = new OutputBuilder().build();
    SpyOn(mockOutput, "outputResults");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const completeEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    completeEventHandler({});

    Expect(
      ((mockOutput.outputResults as any) as FunctionSpy).calls[0].args[0]
        .failures
    ).toEqual([]);
  }

  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  public completeEventResultsFailuresSetToFailuresOnResults(failCount: number) {
    const mockOutput = new OutputBuilder().build();
    SpyOn(mockOutput, "outputResults");

    const mockParser = parser();

    SpyOn(mockParser, "on");

    const tapBark = new TapBark(mockOutput, mockParser);

    const completeEventHandler = (mockParser.on as FunctionSpy).calls
      .map(call => call.args)
      .filter(args => args[0] === "complete")[0][1];

    const failures = [];

    for (let i = 0; i < failCount; i++) {
      failures.push({});
    }

    completeEventHandler({ failures });

    Expect(
      ((mockOutput.outputResults as any) as FunctionSpy).calls[0].args[0]
        .failures
    ).toBe(failures);
  }

  @Setup
  private _stubProcessExit() {
    SpyOn(process, "exit").andStub();
  }

  @Teardown
  private _restoreProcessExit() {
    (process.exit as any).restore();
  }
}
