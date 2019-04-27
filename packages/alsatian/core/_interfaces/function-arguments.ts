export type FunctionArguments<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;
