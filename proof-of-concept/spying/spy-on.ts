import { SpyCall } from "./spy-call";

let createSpy = (originalFunction: () => any, context: any) => {

  let stubbedSpy = (): any => {
    return (<any>stubbedSpy).returnValue;
  };

  let spy = (...args: Array<any>) => {
    (<any>spy).calls.push(new SpyCall(args));

    return (<any>spy).handler.apply(context, args);
  };

  (<any>spy).calls = [];

  (<any>spy).return = (value: any) => {
    (<any>stubbedSpy).returnValue = value;
  };

  (<any>spy).andStub = () => {
    (<any>spy).handler = stubbedSpy;
  };

  (<any>spy).andCall = (fakeFunction: () => any) => {
    (<any>spy).handler = fakeFunction;
  };

  (<any>spy).andCallThrough = () => {
    (<any>spy).handler = originalFunction;
  };

  (<any>spy).handler = originalFunction;

  return spy;
}

export function SpyOn(target: any, functionName: string) {
  let originalFunction = target[functionName];

  target[functionName] = createSpy(originalFunction, target);
}
