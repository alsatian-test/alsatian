import { alea } from "seedrandom";

const PropertyTestingConfiguration = {
    seed: "niesamowity-seed"
}

export function initializeRandomNumberGenerator(seed?: string): seedrandom.prng {
    return seed ? alea(seed) : alea(PropertyTestingConfiguration.seed);
} 