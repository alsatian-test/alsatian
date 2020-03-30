export class GeneratorBuilder<T> {

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
