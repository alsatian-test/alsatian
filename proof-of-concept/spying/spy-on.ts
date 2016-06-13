import { SpyCall } from "./spy-call";

let createSpy = (originalFunction: () => any, context: any) => {

  let stubbedSpy = (): any => {
    return (<any>stubbedSpy).returnValue;
  };

  let spy = (...args: Array<any>) => {
    (<any>spy).calls.push(new SpyCall(args));

    return (<any>spy).handler.call(context, args);
  };

  (<any>spy).calls = [];

  (<any>spy).return = (value: any) => {
    (<any>stubbedSpy).returnValue = value;
  };

  (<any>spy).stub = () => {
    (<any>spy).handler = stubbedSpy;
  };

  (<any>spy).fake = (fakeFunction: () => any) => {
    (<any>spy).handler = fakeFunction;
  };

  (<any>spy).original = () => {
    (<any>spy).handler = originalFunction;
  };

  (<any>spy).handler = originalFunction;

  return spy;
}

export function SpyOn(target: any, functionName: string) {
  let originalFunction = target[functionName];

  target[functionName] = createSpy(originalFunction, target);
}
