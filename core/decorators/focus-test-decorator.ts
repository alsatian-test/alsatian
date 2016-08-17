import "reflect-metadata";
import { FOCUS_KEY } from "./_metadata-keys";

export function FocusTest(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {

    // mark test method as focussed
    Reflect.defineMetadata(FOCUS_KEY, true, target, propertyKey);
};
