import { SETUP_FIXTURE } from "./_metadata-keys";
import { createSetupTeardownDecorator } from "./create-setup-teardown-decorator";

// tslint:disable-next-line:variable-name
export const AsyncSetupFixture = createSetupTeardownDecorator(
	SETUP_FIXTURE,
	true
);
