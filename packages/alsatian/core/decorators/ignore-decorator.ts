import { IGNORE, IGNORE_REASON } from "./_metadata-keys";

export function Ignore(reason: string) {
	return (
		target: object | ((...args: Array<any>) => any),
		propertyKey?: string | symbol,
		descriptor?: any
	) => {
		if (propertyKey) {
			// mark test method as ignored
			Reflect.defineMetadata(IGNORE, true, target, propertyKey);

			// add the reason
			Reflect.defineMetadata(IGNORE_REASON, reason, target, propertyKey);
		} else {
			// mark test method as ignored
			Reflect.defineMetadata(IGNORE, true, target);

			// add the reason
			Reflect.defineMetadata(IGNORE_REASON, reason, target);
		}
	};
}
