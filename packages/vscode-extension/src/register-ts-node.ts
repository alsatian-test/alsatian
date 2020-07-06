export async function registerTsNode(tsconfigPath: string | null) {
    //TODO: add error if no tsconfig resolved - this is not likely to be correct setup
    process.env.TS_NODE_PROJECT = tsconfigPath || "";

    await import("tsconfig-paths/register");

    process.env.TS_NODE_TRANSPILE_ONLY = "true";
    await import("ts-node/register");
}
