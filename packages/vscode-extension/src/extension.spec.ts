// import { TestFixture, Test, Expect, SpyOn, TestCase, Any } from "alsatian";
// import "./test/setup-vscode-environment";
// import { activate } from "./extension";
// import { RunTestCommand } from "./commands/run-test-command";
// import { DebugTestCommand } from "./commands/debug-test-command";
// import { RunTestFixtureCommand } from "./commands/run-test-fixture-command";
// import { AlsatianCodeLensProvider } from "./alsatian-code-lens-provider";
// import { ExtensionContext } from "vscode";
// import { TestRunner } from "./running/test-runner";
// import { ExtensionContextBuilder } from "./test/extension-context-builder";

// @TestFixture("Extension Tests")
// export class ExtensionTests {

//     @TestCase(new ExtensionContextBuilder().build())
//     @TestCase(new ExtensionContextBuilder().build())
//     @Test("activate sets up run test command")
//     public activateRunTestCommand(context: ExtensionContext) {

//         SpyOn(RunTestCommand, "setup").andStub();
//         SpyOn(DebugTestCommand, "setup").andStub();
//         SpyOn(RunTestFixtureCommand, "setup").andStub();
//         SpyOn(AlsatianCodeLensProvider, "setup").andStub();

//         activate(context);

//         Expect(RunTestCommand.setup).toHaveBeenCalledWith(context, Any(TestRunner));
//     }

//     @TestCase(new ExtensionContextBuilder().build())
//     @TestCase(new ExtensionContextBuilder().build())
//     @Test("activate sets up debug test command")
//     public activateDebugTestCommand(context: ExtensionContext) {

//         SpyOn(RunTestCommand, "setup").andStub();
//         SpyOn(DebugTestCommand, "setup").andStub();
//         SpyOn(RunTestFixtureCommand, "setup").andStub();
//         SpyOn(AlsatianCodeLensProvider, "setup").andStub();

//         activate(context);

//         Expect(DebugTestCommand.setup).toHaveBeenCalledWith(context);
//     }

//     @TestCase(new ExtensionContextBuilder().build())
//     @TestCase(new ExtensionContextBuilder().build())
//     @Test("activate sets up run test fixture command")
//     public activateRunFixtureCommand(context: ExtensionContext) {

//         SpyOn(RunTestCommand, "setup").andStub();
//         SpyOn(DebugTestCommand, "setup").andStub();
//         SpyOn(RunTestFixtureCommand, "setup").andStub();
//         SpyOn(AlsatianCodeLensProvider, "setup").andStub();

//         activate(context);

//         Expect(RunTestFixtureCommand.setup).toHaveBeenCalledWith(context);
//     }

//     @TestCase(new ExtensionContextBuilder().build())
//     @TestCase(new ExtensionContextBuilder().build())
//     @Test("activate sets up code lens provider")
//     public activateCodeLens(context: ExtensionContext) {

//         SpyOn(RunTestCommand, "setup").andStub();
//         SpyOn(DebugTestCommand, "setup").andStub();
//         SpyOn(RunTestFixtureCommand, "setup").andStub();
//         SpyOn(AlsatianCodeLensProvider, "setup").andStub();

//         activate(context);

//         Expect(AlsatianCodeLensProvider.setup).toHaveBeenCalledWith(context);
//     }
// }
