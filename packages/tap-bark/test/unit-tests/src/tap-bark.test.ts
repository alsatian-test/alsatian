import {
	Test,
	Expect,
	SpyOn,
	Any,
	TestCase,
	Setup,
	Teardown,
	TestFixture
} from "alsatian";
import { TapBark, TapBarkOutputComponent, TapBarkOutputState } from "../../../src/tap-bark";

async function wait(timeInMs: number) {
	return new Promise(resolve => {
		setTimeout(resolve, timeInMs);
	});
}

@TestFixture("tap bark tests")
export default class TapBarkTests {
	private _originalStdErr: any;
	private _originalStdOut: any;
	private _originalProcessExit: any;

	@Setup
	private _spyProcess() {
		this._originalProcessExit = process.exit;
		this._originalStdOut = process.stdout.write;
		this._originalStdErr = process.stderr.write;

		SpyOn(TapBark.tapParser, "on");
		SpyOn(process, "exit").andStub();
		SpyOn(process.stderr, "write").andStub();
		SpyOn(process.stdout, "write").andStub();
	}

	@Teardown
	private _resetProcess() {
		process.exit = this._originalProcessExit;
		process.stdout.write = this._originalStdOut;
		process.stderr.write = this._originalStdErr;
		(TapBark.tapParser.on as any).restore();
	}

	@Test("plan event handled")
	public parserPlanEventHandled() {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		Expect(TapBark.tapParser.on).toHaveBeenCalledWith(
			"plan",
			Any(Function)
		);
	}

	@Test("comment event handled")
	public parserCommentEventHandled() {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		Expect(TapBark.tapParser.on).toHaveBeenCalledWith(
			"comment",
			Any(Function)
		);
	}

	@Test("assert event handled")
	public parserAssertEventHandled() {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		Expect(TapBark.tapParser.on).toHaveBeenCalledWith(
			"assert",
			Any(Function)
		);
	}

	@Test("complete event handled")
	public parserCompleteEventHandled() {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		Expect(TapBark.tapParser.on).toHaveBeenCalledWith(
			"complete",
			Any(Function)
		);
	}

	@Test("create makes a new TapBark")
	public createReturnsInstanceOfTapBark() {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "setState").andStub();
		Expect(tapBark instanceof TapBarkOutputComponent).toBe(true);
	}

	@Test("create a new TapBark instance every time")
	public createNewInstanceOfTapBarkEachCall() {
		const tapBarkOne = TapBark.create();
		SpyOn(tapBarkOne, "setState").andStub();

		const tapBarkTwo = TapBark.create();
		SpyOn(tapBarkTwo, "setState").andStub();
		Expect(tapBarkOne).not.toBe(tapBarkTwo);
	}

	@Test("create a new pipeable instance every time")
	public createNewInstanceOfPipeableEachCall() {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "setState").andStub();

		Expect(tapBark.getPipeable()).not.toBe(tapBark.getPipeable());
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public planEventSetsPlanEndCorrectly(planEnd: number) {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		const setStateSpy = SpyOn(tapBark, "setState");
		setStateSpy.andStub();

		const planEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "plan")[0][1];

		const assertEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "assert")[0][1];

		planEventHandler({ end: planEnd });

		assertEventHandler({ id: 1 });

		Expect(setStateSpy).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches({
				totalTests: planEnd
			})
		);

		Expect(setStateSpy).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches({
				currentTest: 1
			})
		);
	}

	@TestCase("")
	@TestCase("Fixture")
	@TestCase("A really, really awesome fixture!")
	public testFixtureCommentSetsFixtureNameCorrectly(fixtureName: string) {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		const setStateSpy = SpyOn(tapBark, "setState");
		setStateSpy.andStub();

		const commentEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "comment")[0][1];

		commentEventHandler("# FIXTURE " + fixtureName);

		Expect(setStateSpy).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches({
				fixtureName
			})
		);
	}

	@TestCase("#some uninteresting comment")
	@TestCase("# Fixture wrong casing")
	@TestCase("#Fixtureno space")
	public otherCommentsDoNotSetTheFixtureName(comment: string) {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		const setStateSpy = SpyOn(tapBark, "setState");
		setStateSpy.andStub();

		const commentEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "comment")[0][1];

		commentEventHandler(comment);

		Expect(setStateSpy).not.toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches(value => value.fixtureName !== undefined)
		);
	}

	@TestCase("")
	@TestCase("Test")
	@TestCase("A really, really awesome test name!")
	public assertEventSetsTestNameCorrectly(testName: string) {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		const setStateSpy = SpyOn(tapBark, "setState");
		setStateSpy.andStub();

		const assertEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "assert")[0][1];

		assertEventHandler({ name: testName });

		Expect(setStateSpy).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches({
				testName
			})
		);
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public assertEventSetsProgressCorrectly(testId: number) {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		const setStateSpy = SpyOn(tapBark, "setState");
		setStateSpy.andStub();

		const planEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "plan")[0][1];

		const assertEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "assert")[0][1];

		planEventHandler({ end: 42 });

		assertEventHandler({ id: testId });

		Expect(setStateSpy).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches({
				currentTest: testId
			})
		);
	}

	@Test()
	public async completeEventResultsOkExitsProcessCodeZero() {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();

		const completeEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "complete")[0][1];

		completeEventHandler({ ok: true });

		await wait(150);

		Expect(process.exit).toHaveBeenCalledWith(0);
	}

	@Test()
	public async completeEventResultsNotOkExitsProcessCodeOne() {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();

		const completeEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "complete")[0][1];

		completeEventHandler({ ok: false });

		await wait(150);

		Expect(process.exit).toHaveBeenCalledWith(1);
	}

	@Test()
	public async completeEventResultsPassDefaultsToZero() {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		const completeEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "complete")[0][1];

		completeEventHandler({});

		await wait(105);

		Expect(
			tapBark.setState
		).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches(state => state.results.pass === 0),
			Any
		);
	}

	@TestCase(0)
	@TestCase(1)
	@TestCase(42)
	public async completeEventResultsPassSetToPassOnResults(passCount: number) {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		const completeEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "complete")[0][1];

		completeEventHandler({
			ok: true,
			pass: passCount
		});

		await wait(105);

		Expect(
			tapBark.setState
		).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches(state => state.results.pass === passCount),
			Any
		);
	}

	@Test()
	public async completeEventResultsIgnoreDefaultsToZero() {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		const completeEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "complete")[0][1];

		completeEventHandler({});

		await wait(105);

		Expect(
			tapBark.setState
		).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches(state => state.results.ignore === 0),
			Any
		);
	}

	@TestCase(0)
	@TestCase(1)
	@TestCase(42)
	public async completeEventResultsIgnoreSetToSkipOnResults(
		skipCount: number
	) {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		const completeEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "complete")[0][1];

		completeEventHandler({ skip: skipCount });
		await wait(105);

		Expect(
			tapBark.setState
		).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches(state => state.results.ignore === skipCount),
			Any
		);
	}

	@TestCase(0)
	@TestCase(1)
	@TestCase(42)
	public async completeEventResultsIgnoreSetToTodoOnResults(
		todoCount: number
	) {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		const completeEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "complete")[0][1];

		completeEventHandler({ todo: todoCount });
		await wait(105);

		Expect(
			tapBark.setState
		).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches(state => state.results.ignore === todoCount),
			Any
		);
	}

	@TestCase(1, 1)
	@TestCase(2, 2)
	@TestCase(42, 3)
	public async completeEventResultsIgnoreSetToSkipPlusTodoOnResults(
		skipCount: number,
		todoCount: number
	) {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		const completeEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "complete")[0][1];

		completeEventHandler({ skip: skipCount, todo: todoCount });
		await wait(105);

		Expect(
			tapBark.setState
		).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches(state => state.results.ignore === skipCount + todoCount),
			Any
		);
	}

	@Test()
	public async completeEventResultsFailDefaultsToZero() {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		const completeEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "complete")[0][1];

		completeEventHandler({});
		await wait(105);

		Expect(
			tapBark.setState
		).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches(state => state.results.fail === 0),
			Any
		);
	}

	@TestCase(0)
	@TestCase(1)
	@TestCase(42)
	public async completeEventResultsFailSetToFailOnResults(failCount: number) {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		const completeEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "complete")[0][1];

		completeEventHandler({ fail: failCount });
		await wait(105);

		Expect(
			tapBark.setState
		).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches(state => state.results.fail === failCount),
			Any
		);
	}

	@TestCase(0)
	@TestCase(1)
	@TestCase(42)
	public async completeEventResultsFailSetToFailuresLengthOnResults(
		failCount: number
	) {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		const completeEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "complete")[0][1];

		const failures = [];

		for (let i = 0; i < failCount; i++) {
			failures.push({});
		}

		completeEventHandler({ failures });
		await wait(105);

		Expect(
			tapBark.setState
		).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches(state => state.results.fail === failCount),
			Any
		);
	}

	@Test()
	public completeEventResultsFailuresDefaultsToEmptyArray() {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		const completeEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "complete")[0][1];

		completeEventHandler({});

		Expect(
			tapBark.setState
		).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches(state => state.results.failures.length === 0),
			Any
		);
	}

	@TestCase(0)
	@TestCase(1)
	@TestCase(42)
	public async completeEventResultsFailuresSetToFailuresOnResults(
		failCount: number
	) {
		const tapBark = TapBark.create();
		SpyOn(tapBark, "render").andStub();
		SpyOn(tapBark, "setState").andStub();

		const completeEventHandler = (TapBark.tapParser.on as any).calls
			.map(call => call.args)
			.filter(args => args[0] === "complete")[0][1];

		const failures = [];

		for (let i = 0; i < failCount; i++) {
			failures.push({});
		}

		completeEventHandler({ failures });
		await wait(105);

		Expect(
			tapBark.setState
		).toHaveBeenCalledWith(
			Any<TapBarkOutputState>().thatMatches(state => state.results.failures === failures),
			Any
		);
	}}
