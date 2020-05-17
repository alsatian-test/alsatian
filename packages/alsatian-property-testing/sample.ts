import { Expect, TestFixture, Test, TestCases } from "alsatian";
import { Strings } from "./src/strings";
import { GeneratorBuilder } from "./src/generator-builder";
import { Integers } from "./src";
import { Numbers } from "./src/numbers";

@TestFixture("property tests")
export class PropertyTests {
    @Test()
    public test() {
        var generator = new Objects<TestInterface>({propTwo: "duuupa"}).withProp("propThree", 2).withProp("propOne", "test").build(20)();


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

class ObjectPropertyBuilder<T = any> {

    with(callback: (obj: T) => void) {
        return this;
    }

    build(count: number) {
        return function*() {

        }
    }
}

// THESE SHOULD LIKELY BE BUILDERS ENDING WITH buildCount(x: number) to return the generator
class Objects<T = { [prop: string]: any }> {
    private constructedObject: Partial<T>;

    // private propGenerators: { propName: keyof T, generaotr: Generator<number | string, void, unknown>[] };

    // For things that we might want to be constant like ids or other props. I think that might make life easier
    constructor(object?: Partial<T>) {
       this.constructedObject = { ...object };
    }

    // parametrem moze byc albo generator.... albo generator builder? jak to sprytnie owinac
    withProp(propName: keyof T, value: any /*, generator: Generator<number | string, void, unknown>*/) {
        this.constructedObject = { ...this.constructedObject, [propName]: value}
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
                yield { ...self.constructedObject };
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


// import { Expect, TestFixture, Test, TestCases } from "alsatian";
// import { Integers } from "./src/integers";

// @TestFixture("property tests")
// export class PropertyTests {

//     @TestCases(Integers.between(0, 4))
//     @TestCases(Integers.random({ between: { lowerLimit: 1000, upperLimit: 1000000 }}).generate(16))
//     @Test("sample integer test")
//     public test(value: number) {
//         Expect(value).toBeLessThan(4);
//     }

// /*
//     //TODO: what if the two generators result in two different amounts of arguments?
//     @TestCases(Integers.Between(0, 42), Integers.Between(1, 43))
//     @Test("sample two integer test")
//     public twoIntegerSample(small: number, big: number) {
//         Expect(small).toBeLessThan(big);
//     }
//     @TestCases(Objects.with(x => x.name = randomString()).with(x => x).build(42))
//     @TestCases(Objects<{ name: string }>.with(x => x.name = randomString()).with(x => x).build(42))
//     @TestCases(Strings.ofLength(12).withCharSet(utf8).build(42))*/
// }


// class ObjectPropertyBuilder<T = any> {

//     with(callback: (obj: T) => void) {
//         return this;
//     }

//     build(count: number) {
//         return function*() {

//         }
//     }
// }

// // THESE SHOULD LIKELY BE BUILDERS ENDING WITH buildCount(x: number) to return the generator
// class Objects<T = { [prop: string]: any }> {
//     /*static with(assign: (obj: T) => void) {
//         return new ObjectPropertyBuilder<T>().with(assign);
//     }*/
// }

// class Arrays {
//     static Random<V>(count: number, options?: { length: () => number, fill: () => V }) {
//         return function*() {

//         }
//     }
// }