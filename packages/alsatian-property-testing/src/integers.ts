export class Integers {
    static between(lowerLimit: number, upperLimit: number) {
        if (upperLimit <= lowerLimit) {
            throw new TypeError("upper limit must be greater than lower limit");
        }

        return function* () {
            while(lowerLimit <= upperLimit) {
                // looks like TestCases expects an array to be returned
                // need to think of transition to have this more declarative approach
                yield lowerLimit++;
            }
        }
    }

    static random(options?: { between: { upperLimit: number, lowerLimit: number }}) {
        const upperLimit = options?.between.upperLimit ?? 100;
        const lowerLimit = options?.between.lowerLimit ?? 0;

        if (upperLimit <= lowerLimit) {
            throw new TypeError("upper limit must be greater than lower limit");
        }

        return new GeneratorBuilder(() => Math.round(Math.random() * upperLimit + lowerLimit));
    }
}

class GeneratorBuilder<T> {

    public constructor(private generator: () => T) {}

    public generate(count: number) {
        if (count < 1) {
            throw new TypeError("must generate at least one");
        }

        let returnedCount = 0;

        const generator = this.generator;

        return function* () {
            while (returnedCount < count) {
                yield generator();
                returnedCount++;
            }
        }
    }
}
