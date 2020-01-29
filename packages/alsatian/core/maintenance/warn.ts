export class Warner {
	public static readonly warnings = [] as Array<string>;

	public static warn(message: string) {
		if (Warner.warnings.indexOf(message) === -1) {
			Warner.warnings.push(message);
		}
	}
}
