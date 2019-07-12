import ExtendoError from "extendo-error";

export class MatchError<ActualType = undefined, ExpectedType = undefined, ExtrasType extends { [prop: string]: any } = undefined> extends ExtendoError {

	public readonly actual: ActualType;
	public readonly expected: ExpectedType;
	public readonly extras: { [prop: string]: any };

	public constructor(
		message?: string,
		expectedValue?: ExpectedType,
		actualValue?: ActualType,
		extras?: ExtrasType
	) {
		super(message);

		this.actual = actualValue;
		this.expected = expectedValue;
		this.extras = extras;
	}
}
