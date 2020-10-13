import {
	WebstormExecutionPlan,
	WebstormTestFileExecutionPlan,
	WebstormTestSuiteExecutionPlan
} from "./WebstormExecutionPlan";
import * as fs from "fs";
import { TestSet } from "alsatian";

export class ExecutionPlanUtil {

	filterFocusedTestsBasedOnExecutionPlan(executionPlanFile: string, testSet: TestSet) {
		const testFiles = [];
		let executionPlanString = fs.readFileSync(executionPlanFile, "UTF-8");
		let executionPlan: WebstormExecutionPlan = JSON.parse(executionPlanString);
		for (const testFileExecutionPlan of executionPlan.testFileExecutionPlans) {
			testFiles.push(testFileExecutionPlan.locationUrl);
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

	private executionPlanContainsFixture(executionPlan: WebstormExecutionPlan, testFixtureClassName: string) {
		for (const testFileExecutionPlan of executionPlan.testFileExecutionPlans) {
			//all suites if no filter
			if (this.isExecuteAllSuitesInFile(testFileExecutionPlan))
				return true;
			else {
				return this.findTestSuiteExecutionPlan(testFileExecutionPlan, testFixtureClassName) != null;
			}
		}
		return false;
	}

	private executionPlanContainsTestMethod(executionPlan: WebstormExecutionPlan, testFixtureClassName: string, testMethodName: string) {
		for (const testFileExecutionPlan of executionPlan.testFileExecutionPlans) {
			if (this.isExecuteAllSuitesInFile(testFileExecutionPlan))
				return true;
			else {
				let testSuiteExecutionPlan = this.findTestSuiteExecutionPlan(testFileExecutionPlan, testFixtureClassName);
				if (testSuiteExecutionPlan != null)
					this.testSuiteExecutionPlanContainsTestMethod(testSuiteExecutionPlan, testMethodName);
			}
		}
		return false;
	}

	private testSuiteExecutionPlanContainsTestMethod(testSuiteExecutionPlan: WebstormTestSuiteExecutionPlan, testMethodName: string) {
		if (this.isExecuteAllTestMethodsInSuite(testSuiteExecutionPlan))
			return true;
		for (const testMethodExecutionPlan of testSuiteExecutionPlan.testMethodExecutionPlans) {
			if (testMethodExecutionPlan.testName === testMethodName)
				return true;
		}
		return false;
	}

	private findTestSuiteExecutionPlan(testFileExecutionPlan: WebstormTestFileExecutionPlan, testFixtureClassName: string) {
		for (const testSuiteExecutionPlan of testFileExecutionPlan.testSuiteExecutionPlans) {
			if (testSuiteExecutionPlan.suiteName === testFixtureClassName)
				return testSuiteExecutionPlan;
		}
		return null;
	}

	private isExecuteAllSuitesInFile(testFileExecutionPlan: WebstormTestFileExecutionPlan) {
		//all suites no filter
		return testFileExecutionPlan.testSuiteExecutionPlans.length == 0;
	}

	private isExecuteAllTestMethodsInSuite(testSuiteExecutionPlan: WebstormTestSuiteExecutionPlan) {
		return testSuiteExecutionPlan.testMethodExecutionPlans.length == 0;
	}
}
