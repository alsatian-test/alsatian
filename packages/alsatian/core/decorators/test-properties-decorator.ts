import "reflect-metadata";
import { TEST_PROPERTIES } from "./_metadata-keys";
import { Unused } from "../unused";
import { markPropertyAsTest } from "./mark-property-as-test";

export function TestProperties(
	propertyTestArguments: Generator<any, void, unknown> | Array<Generator<any, void, unknown>>
): (
	target: object,
	propertyKey: string,
	descriptor?: TypedPropertyDescriptor<any>
) => void {
	return (
		target: object,
		propertyKey: string,
		descriptor?: TypedPropertyDescriptor<any>
	) => {
		Unused(descriptor);

		markPropertyAsTest(propertyKey, target);

		let testProperties: Array<any> = Reflect.getMetadata(
			TEST_PROPERTIES,
			target,
			propertyKey
		);

		// if not create an empty array
		if (!testProperties) {
			testProperties = [];
		}

		// add the test case to the list
		testProperties.unshift(propertyTestArguments);

		Reflect.defineMetadata(TEST_PROPERTIES, testProperties, target, propertyKey);
	};
}
