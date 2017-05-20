import { MatchError } from "../errors";

export function fail(message: string) {
    throw new MatchError(message);
}