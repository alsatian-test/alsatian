export class Warner {
    public static readonly warnings = [] as Array<string>;

    public static warn(message: string) {
        Warner.warnings.push(message);
    }
}
