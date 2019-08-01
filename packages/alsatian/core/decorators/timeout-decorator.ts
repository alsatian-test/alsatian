import "reflect-metadata";
import { TIMEOUT } from "./_metadata-keys";
import { Unused } from "../unused";

export function Timeout(timeoutInMs: number) {
	if (timeoutInMs <= 0) {
		throw new RangeError("Timeout period must be greater than 0.");
	}

	return (
		target: object,
		propertyKey: string,
		descriptor?: TypedPropertyDescriptor<any>
	) => {
		Unused(descriptor);

		Reflect.defineMetadata(TIMEOUT, timeoutInMs, target, propertyKey);
	};
}
