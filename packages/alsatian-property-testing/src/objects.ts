import { initializeRandomNumberGenerator } from "./utils/seedable-rng";

export class Objects<T = { [prop: string]: any }> {
    private constructedObject: Partial<T>;
    private valueMatrix: {[id: string]: any[] };

    constructor(object?: Partial<T>) {
       this.constructedObject = { ...object };
       this.valueMatrix = {};
    }

    withProp(propName: keyof T, generator: Generator<any, void, unknown>) {
        let iteration = generator.next();
        let values = [];

        while(iteration.done === false) {
            values.push(iteration.value);
            iteration = generator.next();
        };

        this.valueMatrix[propName as string] = values;
        return this;
    }

    build(count: number, seed?: string) {
        if (!count || count < 0) {
            throw new TypeError("Count need to be truthy positive value");
        }

        var self = this;
        let counter = 0;
        const randomGenerator = initializeRandomNumberGenerator(seed);

        return function* () {
            while(counter <= count) {
                let obj = { ...self.constructedObject };

                for (let key in self.valueMatrix) {
                    obj = {...obj, [key]: self.valueMatrix[key][Math.floor(randomGenerator() * self.valueMatrix[key].length)]}
                }

                yield obj;
                counter++;
            }
        }
    }
}
