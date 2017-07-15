export interface ITester {
    stringify: () => string;
    test: (value: any) => boolean;
}
