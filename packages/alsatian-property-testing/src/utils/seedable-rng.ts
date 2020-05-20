import { alea } from "seedrandom";

export const PropertyTestingConfiguration = {
    seed: "99"
}

export function initializeRandomNumberGenerator(seed?: string): seedrandom.prng {
    return seed ? alea(seed) : alea(PropertyTestingConfiguration.seed);
} 