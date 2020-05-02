import { Expect, TestFixture, Test, TestCases } from "alsatian";
import { Integers } from "./src/integers";

@TestFixture("property tests")
export class PropertyTests {

    @TestCases(Integers.between(0, 4))
    @TestCases(Integers.random({ between: { lowerLimit: 1000, upperLimit: 1000000 }}).generate(16))
    @Test("sample integer test")
    public test(value: number) {
        Expect(value).toBeLessThan(4);
    }
/*
    @TestCases(Numbers.EdgeCases)
    @Test("weird numbers break")
    public weird(value: number) {
        const func = (n: number) => {};
        Expect(() => func(value)).toThrowError(TypeError, "number is weird");
    }

    //TODO: what if the two generators result in two different amounts of arguments?
    @TestCases(Integers.Between(0, 42), Integers.Between(1, 43))
    @Test("sample two integer test")
    public twoIntegerSample(small: number, big: number) {
        Expect(small).toBeLessThan(big);
    }

    @TestCases(Objects.with(x => x.name = randomString()).with(x => x).build(42))
    @TestCases(Objects<{ name: string }>.with(x => x.name = randomString()).with(x => x).build(42))
    @TestCases(Strings.ofLength(12).withCharSet(utf8).build(42))*/
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
    /*static with(assign: (obj: T) => void) {
        return new ObjectPropertyBuilder<T>().with(assign);
    }*/
}

class Arrays {
    static Random<V>(count: number, options: { length?: () => number, fill: () => V }) {
        

        return function*() {
            
        }
    }
}


