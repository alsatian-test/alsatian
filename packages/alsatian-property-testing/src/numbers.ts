export class Numbers {
    static Between(lowerLimit: number, upperLimit: number, step: number) {
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
}
