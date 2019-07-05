import { TEARDOWN_FIXTURE } from "./_metadata-keys";
import { createSetupTeardownDecorator } from "./create-setup-teardown-decorator";

// tslint:disable-next-line:variable-name
export const AsyncTeardownFixture = createSetupTeardownDecorator(
	TEARDOWN_FIXTURE,
	true
);
