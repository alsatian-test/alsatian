export interface ITester {
    test: (value: any) => boolean;
    stringify: () => string;
}
