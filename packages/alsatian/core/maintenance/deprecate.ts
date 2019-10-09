import { Warner } from "./warn";

export function deprecate(
	featureName: string,
	versionToBeRemoved: string,
	prompt: string
) {
	Warner.warn(
		`${featureName} has been deprecated and will be removed in version ${versionToBeRemoved}.` +
			(prompt ? ` ${prompt}` : "")
	);
}
