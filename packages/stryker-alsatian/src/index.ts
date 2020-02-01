import { declareClassPlugin, PluginKind } from "@stryker-mutator/api/plugin";
import { AlsatianTestFramework } from "./test-framework";
import { AlsatianTestRunner } from "./test-runner";

const ALSATIAN = "alsatian";

export const strykerPlugins = [
    declareClassPlugin(PluginKind.TestFramework, ALSATIAN, AlsatianTestFramework),
    declareClassPlugin(PluginKind.TestRunner, ALSATIAN, AlsatianTestRunner)
];
