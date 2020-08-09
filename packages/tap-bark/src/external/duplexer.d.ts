/// <reference types="node" />

declare module "duplexer" {
	import { Transform, Writable } from "stream";

	export default function duplexer(
		streamA: Transform,
		streamB: Transform
	): Writable;
}
