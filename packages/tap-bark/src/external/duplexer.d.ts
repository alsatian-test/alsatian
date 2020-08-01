/// <reference types="node" />

declare module "duplexer" {
    import { Transform } from "stream";

    export default function duplexer(streamA: Transform, streamB: Transform): void;
}
