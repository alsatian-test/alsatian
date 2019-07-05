import { FOCUS } from "./_metadata-keys";

export function Focus(
	target: object | (new (...args: Array<any>) => object),
	propertyKey?: string | symbol
) {
	if (propertyKey) {
		// mark test method as focussed
		Reflect.defineMetadata(FOCUS, true, target, propertyKey);
	} else {
		// mark test method as focussed
		Reflect.defineMetadata(FOCUS, true, target);
	}
}
