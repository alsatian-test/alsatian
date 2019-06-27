export type FunctionArguments<T extends (...args: Array<any>) => any> = T extends (...args: infer P) => any ? P : never;
