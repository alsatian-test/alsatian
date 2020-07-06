// import { fork } from "child_process";
// import { join } from "path";
// import { TestFixture, Test, Expect, TestOutcome, Timeout, Focus } from "alsatian";
// import { IMessage } from "./message";

// @TestFixture("Run Process Tests")
// export class RunProcessTests {

//     @Timeout(5000)
//     @Test("passing test")
//     //TODO: figure out why running with vscode extension doesn't work here (double fork perhaps?)
//     public async passingTest() {
//         const specFile = join(__dirname, "../samples/example.spec.ts");
//         const runFile = join(__dirname, `./run`);

//         const runProcess = fork(runFile, [ specFile, "SampleTestFixture", "passing" ], {
//             execArgv: [ "-r", "ts-node/register" ],
//             env: {
//                 "TS_NODE_TRANSPILE_ONLY": "true"
//             }
//           });

//         const message = await new Promise<IMessage>(resolve => {
//             runProcess.on("message", msg => {
//                 if (msg.type === "testComplete") {
//                     resolve(msg);
//                 }
//             });
//         });

//         Expect(message.results?.length).toBe(1);
//         Expect(message.results?.[0].outcome).toBe(TestOutcome.Pass);
//         Expect(message.results?.[0].error).toBeNull();
//     }

//     @Timeout(5000)
//     @Test("failing test")
//     public async failingTest() {
//         const specFile = join(__dirname, "../samples/example.spec.ts");
//         const runFile = join(__dirname, `./run`);

//         const runProcess = fork(runFile, [ specFile, "SampleTestFixture", "failing" ], {
//             execArgv: [ "-r", "ts-node/register" ],
//             env: {
//                 "TS_NODE_TRANSPILE_ONLY": "true"
//             }
//           });

//         const message = await new Promise<IMessage>(resolve => {
//             runProcess.on("message", msg => {
//                 if (msg.type === "testComplete") {
//                     resolve(msg);
//                 }
//             });
//         });

//         Expect(message.results?.length).toBe(1);
//         Expect(message.results?.[0].outcome).toBe(TestOutcome.Fail);
//     }

//     @Timeout(5000)
//     @Test("erroring test")
//     public async erroringTest() {
//         const specFile = join(__dirname, "../samples/example.spec.ts");
//         const runFile = join(__dirname, `./run`);

//         const runProcess = fork(runFile, [ specFile, "SampleTestFixture", "erroring" ], {
//             execArgv: [ "-r", "ts-node/register" ],
//             env: {
//                 "TS_NODE_TRANSPILE_ONLY": "true"
//             }
//         });

//         const message = await new Promise<IMessage>(resolve => {
//             runProcess.on("message", msg => {
//                 if (msg.type === "testComplete") {
//                     resolve(msg);
//                 }
//             });
//         });

//         Expect(message.results?.length).toBe(1);
//         Expect(message.results?.[0].outcome).toBe(TestOutcome.Error);
//         Expect(message.results?.[0].error?.message).toBe("Wow, this is always going to break!");
//     }
// }
