import { PropertySpy } from "../_spying";

export function SpyOnProperty<PropertyType>(target: any, propertyName: string): PropertySpy<PropertyType> {

   const propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyName);

   if (propertyDescriptor !== undefined) {
      return new PropertySpy<PropertyType>(target, propertyName);
   }
   else {
      throw new TypeError(`${propertyName} is not a property.`);
   }
}
