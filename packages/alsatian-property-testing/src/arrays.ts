export class Arrays {
    static Random<V>(count: number, options: { length?: () => number, fill: () => V }) {
        let currentCount = 0;

        let lengthFunc = () => Math.floor(Math.random() * 100) + 1;
        
        if (options?.length) {
            lengthFunc = options.length;
        }
        

        return function*() {
            while (currentCount <= count) { 
                let arr = new Array<V>(lengthFunc());
                yield arr.fill(options.fill());
            }
        }
    }
}