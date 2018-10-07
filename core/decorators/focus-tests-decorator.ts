import "reflect-metadata";
import { FOCUS } from "./_metadata-keys";
import { Constructor } from "../_interfaces";
import { deprecate } from "../maintenance/deprecate";

export function FocusTests(constructor: Constructor) {

  deprecate("FocusTests", "4.0.0", "Use the Focus decorator instead.");

  // mark test class as focussed
  Reflect.defineMetadata(FOCUS, true, constructor);
}
