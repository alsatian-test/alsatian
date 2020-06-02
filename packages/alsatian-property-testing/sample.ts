import { TestFixture, TestProperties, Test, TestCases } from "alsatian";
import { Strings } from "./src/strings";
import { Numbers } from "./src/numbers";
import { Objects } from "./src/objects";

@TestFixture("property tests")
export class PropertyTests {
    
    @TestProperties(Strings.Below(10).generate(10)())
    @Test()
    public test(testXd: string) {
        const x = testXd;
        const z = x;
    }
}


interface TestInterface {
    propOne: string,
    propTwo: string;
    propThree: number;
}
