import "reflect-metadata";
import { FOCUS } from "./_metadata-keys";
import { Unused } from "../unused";

export function FocusTest(target: object, propertyKey: string, descriptor?: TypedPropertyDescriptor<any>) {
    Unused(descriptor);

    // mark test method as focussed
    Reflect.defineMetadata(FOCUS, true, target, propertyKey);
}
