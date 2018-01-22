import "reflect-metadata";
import { FOCUS } from "./_metadata-keys";
import { Constructor } from "../_interfaces";

export function FocusTests(constructor: Constructor) {
  // mark test class as focussed
  Reflect.defineMetadata(FOCUS, true, constructor);
}
