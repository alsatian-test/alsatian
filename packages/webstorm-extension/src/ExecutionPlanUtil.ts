import {WebstormExecutionPlan} from "./WebstormExecutionPlan";
import * as fs from "fs";
import { TestSet } from "alsatian";

export class ExecutionPlanUtil {

    filterFocusedTestsBasedOnExecutionPlan(executionPlanFile: string, testSet: TestSet) {
        const testFiles = [];
        let executionPlanString = fs.readFileSync(executionPlanFile, "UTF-8");
        let executionPlan: WebstormExecutionPlan = JSON.parse(executionPlanString);
        for (const testFileExecutionPlan of executionPlan.testFileExecutionPlans) {
            testFiles.push(testFileExecutionPlan.locationUrl)
        }
        testSet.addTestsFromFiles(testFiles);
        let filteredFixtures = testSet.testFixtures.filter(x => this.executionPlanContainsFixture(executionPlan, x.fixture.constructor.name));
        for (const filteredFixture of filteredFixtures) {
            filteredFixture.focussed = true;
            let iTests = filteredFixture.tests.filter(x => this.executionPlanContainsTestMethod(executionPlan, filteredFixture.fixture.constructor.name, x.key));
            for (const iTest of iTests) {
                iTest.focussed = true;
            }
        }

    }

    private executionPlanContainsFixture(executionPlan: WebstormExecutionPlan, name: string) {
        for (const testFileExecutionPlan of executionPlan.testFileExecutionPlans) {
            //all suites if no filter
            if (testFileExecutionPlan.testSuiteExecutionPlans.length == 0)
                return true;
            for (const testSuiteExecutionPlan of testFileExecutionPlan.testSuiteExecutionPlans) {
                if (testSuiteExecutionPlan.suiteName === name)
                    return true;
            }
        }
        return false;
    }

    private executionPlanContainsTestMethod(executionPlan: WebstormExecutionPlan, name: string, key: string) {
        for (const testFileExecutionPlan of executionPlan.testFileExecutionPlans) {
            //all suites no filter
            if (testFileExecutionPlan.testSuiteExecutionPlans.length == 0)
                return true;
            for (const testSuiteExecutionPlan of testFileExecutionPlan.testSuiteExecutionPlans) {
                if (testSuiteExecutionPlan.suiteName === name) {
                    //all test methods if no filter
                    if (testSuiteExecutionPlan.testMethodExecutionPlans.length == 0)
                        return true;
                    for (const testMethodExecutionPlan of testSuiteExecutionPlan.testMethodExecutionPlans) {
                        if (testMethodExecutionPlan.testName === key)
                            return true;
                    }
                }
            }
        }
        return false;
    }

}
