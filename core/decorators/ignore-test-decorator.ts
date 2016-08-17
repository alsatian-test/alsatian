import "reflect-metadata";
import { IIgnoredTestInfo } from "../_interfaces/ignored-test-info.i";

export function IgnoreTest(reason?: string) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        let testInfo: IIgnoredTestInfo = {
            ignored: true,
            reason: reason
        };

        // mark test method as ignored
        Reflect.defineMetadata("alsatian:ignore", testInfo, target, propertyKey);
    };
}
