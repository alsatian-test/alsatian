import { PropertySpy } from "../_spying";

export function SpyOnProperty<PropertyType>(target: any, propertyName: string): PropertySpy<PropertyType> {

   return new PropertySpy<PropertyType>(target, propertyName);
}
