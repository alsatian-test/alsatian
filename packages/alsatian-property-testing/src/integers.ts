import { GeneratorBuilder } from "./generator-builder";
import { initializeRandomNumberGenerator } from "./utils/seedable-rng";

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

    static random(options?: { between?: { upperLimit: number, lowerLimit: number }, seed?: string}) {
        const upperLimit = options?.between?.upperLimit ?? 100;
        const lowerLimit = options?.between?.lowerLimit ?? 0;

        const randomGenerator = initializeRandomNumberGenerator(options?.seed);

        if (upperLimit <= lowerLimit) {
            throw new TypeError("upper limit must be greater than lower limit");
        }

        return new GeneratorBuilder(() => Math.round(randomGenerator() * (upperLimit - lowerLimit + 1)) + lowerLimit);
    }
}
