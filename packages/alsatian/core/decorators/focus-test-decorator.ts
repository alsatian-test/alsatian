import "reflect-metadata";
import { FOCUS } from "./_metadata-keys";
import { Unused } from "../unused";
import { deprecate } from "../maintenance/deprecate";

export function FocusTest(
	target: object,
	propertyKey: string,
	descriptor?: TypedPropertyDescriptor<any>
) {
	Unused(descriptor);

	deprecate("FocusTest", "4.0.0", "Use the Focus decorator instead.");

	// mark test method as focussed
	Reflect.defineMetadata(FOCUS, true, target, propertyKey);
}
