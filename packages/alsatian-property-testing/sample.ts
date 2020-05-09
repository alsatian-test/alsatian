import { Expect, TestFixture, Test, TestCases } from "alsatian";
import { Integers } from "./src/integers";
import { Arrays } from "./src/arrays";
import { Strings } from "./src/strings";

@TestFixture("property tests")
export class PropertyTests {
    @Test("test")
    public test() {
        var generator = Objects.withProps([{propName: "a", valueGenerator: Strings.OfLength(10) }, {propName: "b", valueGenerator: Strings.OfLength(10).generate(1) }]);

        var result = generator.next().value as Array<string>;
        Expect(result.length).toBeGreaterThan(0);
        Expect(result.length).toBeLessThan(102);
        Expect(result[0]).toBe("test");
    }

    // @Test("test")
    // public test() {
    //     var generator = Objects.withProps([{propName: "a", valueGenerator: Strings.OfLength(10).generate(1) }, {propName: "b", valueGenerator: Strings.OfLength(10).generate(1) }]);

    //     var result = generator.next().value as Array<string>;
    //     Expect(result.length).toBeGreaterThan(0);
    //     Expect(result.length).toBeLessThan(102);
    //     Expect(result[0]).toBe("test");
    // }
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
    static with(assign: (obj: T) => void) {
        return new ObjectPropertyBuilder<T>().with(assign);
    }
}


// class Objects {
//     static withProps<T = { [prop: string]: any }>(assign: (obj: T) => void) {
//         return new ObjectPropertyBuilder<T>().with(assign);
//     }
// }

// class Objects {
//     static withProps(assign: Property[]) {
        
//     }
// }

// interface Property {
//     propName: string,
//     valueGenerator: () => any;
// }

