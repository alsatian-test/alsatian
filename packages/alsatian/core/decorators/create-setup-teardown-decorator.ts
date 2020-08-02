import "reflect-metadata";
import { ISetupTeardownMetadata } from "./_interfaces";

export function createSetupTeardownDecorator(
	metadataDescription: string
) {
	return (
		target: object,
		decoratedPropertyKey: string,
		descriptor?: TypedPropertyDescriptor<() => any>
	) => {
		const functions: Array<ISetupTeardownMetadata> =
			Reflect.getMetadata(metadataDescription, target) || [];

		functions.push({
			propertyKey: decoratedPropertyKey
		});

		Reflect.defineMetadata(metadataDescription, functions, target);
	};
}
