import { PropertySpy } from "../_spying";

export function SpyOnProperty(target: any, propertyName: string): PropertySpy {

   const propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyName);

   if (propertyDescriptor !== undefined) {
      return new PropertySpy(target, propertyName);
   }
   else {
      throw new TypeError(`${propertyName} is not a property.`);
   }
}
