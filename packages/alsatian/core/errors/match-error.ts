import ExtendoError from "extendo-error";

export class MatchError extends ExtendoError {
	public readonly actual: any;
	public readonly expected: any;
	public readonly extras: { [prop: string]: any } | undefined;

	public constructor(
		message?: string,
		expectedValue?: any,
		actualValue?: any,
		extras?: { [prop: string]: any }
	) {
		super(message);

		this.actual = actualValue;
		this.expected = expectedValue;
		this.extras = extras;
	}
}
