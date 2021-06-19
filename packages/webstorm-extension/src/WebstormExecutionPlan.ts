export interface WebstormTestMethodExecutionPlan {
    testName: string;
}

export interface WebstormTestSuiteExecutionPlan {
    testMethodExecutionPlans: WebstormTestMethodExecutionPlan[];
    suiteName: string;
}

export interface WebstormTestFileExecutionPlan {
    testSuiteExecutionPlans: WebstormTestSuiteExecutionPlan[];
    locationUrl: string;
}

export interface WebstormExecutionPlan {
    testFileExecutionPlans: WebstormTestFileExecutionPlan[];
}
