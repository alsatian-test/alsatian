import { TEARDOWN } from "./_metadata-keys";
import { createSetupTeardownDecorator } from "./create-setup-teardown-decorator";

// tslint:disable-next-line:variable-name
export const Teardown = createSetupTeardownDecorator(TEARDOWN, false);
