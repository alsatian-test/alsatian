import { Warner } from "./warn";

export function deprecate(
  featureName: string,
  versionToBeRemoved: string,
  prompt: string
) {
  Warner.warn(
    `${featureName} has been depreacated and will be removed in version ${versionToBeRemoved}.` +
      (prompt ? ` ${prompt} ` : "") +
      `Please check the migration guide on the Alsatian Github repo for more information.`
  );
}
