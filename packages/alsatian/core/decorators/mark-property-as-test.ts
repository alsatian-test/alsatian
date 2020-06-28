import "reflect-metadata";
import { TESTS } from "./_metadata-keys";

export function markPropertyAsTest(propertyKey: string, target: object) {

	// check if this has been registered as a test already
	const tests: Array<any> = Reflect.getMetadata(TESTS, target) || [];

	if (tests.filter(test => test.key === propertyKey).length === 0) {
		// otherwise add it to the register
		tests.push({
			key: propertyKey
		});
		Reflect.defineMetadata(TESTS, tests, target);
	}
}
