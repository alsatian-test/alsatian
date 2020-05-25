import { Expect, TestFixture, Test, TestCases } from "alsatian";
import { Strings } from "./src/strings";
import { GeneratorBuilder } from "./src/generator-builder";
import { Integers } from "./src";
import { Numbers } from "./src/numbers";

@TestFixture("property tests")
export class PropertyTests {
    @Test()
    public test() {
        var generator = new Objects<TestInterface>({propTwo: "duuupa"}).withProp("propThree", Strings.Below(10).generate(10)()).withProp("propOne", Numbers.Between(1, 6, 1)()).build(20)();


        var g1 = generator.next().value;
        var g2 = generator.next().value;
        var g3 = generator.next().value;
        var g4 = generator.next().value;
        var g5 = generator.next().value;
        var g6 = generator.next().value;
        var g7 = generator.next().value;
        var g8 = generator.next().value;        
    }
}

class Objects<T = { [prop: string]: any }> {
    private constructedObject: Partial<T>;
    private valueMatrix: {[id in keyof T]: any[] };

    constructor(object?: Partial<T>) {
       this.constructedObject = { ...object };
    }

    withProp(propName: keyof T, generator: Generator<number | string | object, void, unknown>) {
        let iteration = generator.next();
        let values = [];

        while(iteration.done === false) {
            values.push(iteration.value);
            iteration = generator.next();
        };

        this.valueMatrix[propName] = values;
        return this;
    }

    build(count: number) {
        if (!count || count < 0) {
            throw new TypeError("Count need to be truthy positive value");
        }

        var self = this;
        let counter = 0;

        return function* () {
            while(counter <= count) {
                let obj = { ...self.constructedObject };

                for (let key in self.valueMatrix) {
                    obj = {...obj, [key]: self.valueMatrix[key][Math.floor(Math.random() * self.valueMatrix[key].length)]}
                }

                yield obj;
                counter++;
            }
        }
    }
}

interface TestInterface {
    propOne: string,
    propTwo: string;
    propThree: number;
}
