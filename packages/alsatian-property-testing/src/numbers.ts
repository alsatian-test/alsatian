export class Numbers {
    static Between(lowerLimit: number, upperLimit: number, step: number) {
        if (upperLimit <= lowerLimit) {
            throw new TypeError("upper limit must be greater than lower limit");
        }

        if (step === 0) {
            throw new TypeError("step cannot be equal to zero");
        }

        return function* () {
            while(lowerLimit <= upperLimit) {
                yield lowerLimit;
                lowerLimit += step;
            }
        }
    }

    static EdgeCases = function* () {
        yield NaN;
        yield Infinity;
        yield -Infinity;
    }

    static Falsy = function* () {
        yield 0;
        yield -0;
        yield NaN;
        yield null;
        yield undefined;
    }
}
