export type ClassAndMethodDecorator<T> = ((
  target: T | (new (...args: Array<any>) => T),
  propertyKey?: keyof T,
  descriptor?: TypedPropertyDescriptor<T>
) => void);

export function createClassAndMethodDecorator<T>(
  decoratorFunction: ClassAndMethodDecorator<T>
): ClassAndMethodDecorator<T> {
  return decoratorFunction;
}
