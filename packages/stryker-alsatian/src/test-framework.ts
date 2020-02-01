import { TestFramework, TestSelection } from '@stryker-mutator/api/test_framework';
import { Logger } from '@stryker-mutator/api/logging';
import { commonTokens, tokens } from '@stryker-mutator/api/plugin';

export class AlsatianTestFramework implements TestFramework {
    
    public static inject = tokens(commonTokens.logger);
    private id = Math.random().toString(36).substr(2);

    private log(message: string) {
        this.logger.trace(`${this.id}: ${message}`);
    }

    public constructor(private logger: Logger) {}

    /**
     * Creates a code fragment which, if included in a test run,
     * is run before a particular test is run.
     */
    public beforeEach(codeFragment: string): string {
        this.log(`beforeEach called function beforeSpec() { ${codeFragment} }`);// with ${codeFragment}`);
        return `register("beforeEach", (function () { ${codeFragment} }).bind(this))`;
    }

    /**
     * Creates a code fragment which, if included in a test run,
     * is run before a particular test is run.
     */
    public afterEach(codeFragment: string): string {
        this.log(`afterEach called`);// with ${codeFragment}`);
        return `register("afterEach", (function () { ${codeFragment} }).bind(this))`;
    }

    public filter(testSelections: TestSelection[]): string {
        this.log(`filter called`);// with ${JSON.stringify(testSelections)}`);
        return `register("filterSpecs", (function () { ${JSON.stringify(testSelections)} }).bind(this))`;
    }
}
