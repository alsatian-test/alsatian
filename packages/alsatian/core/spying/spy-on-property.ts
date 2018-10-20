import { PropertySpy } from "../spying";

export function SpyOnProperty<PropertyType>(
  target: any,
  propertyName: string
): PropertySpy<PropertyType> {
  return new PropertySpy<PropertyType>(target, propertyName);
}
