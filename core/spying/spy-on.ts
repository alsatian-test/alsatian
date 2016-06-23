import {
    SpyCall,
    Spy
} from "./_namespace";

export function SpyOn(target: any, functionName: string) {

  let spy = new Spy(target[functionName], target);

  target[functionName] = (...args: Array<any>) => {
    return spy.call(args);
  };

  // expose spy's calls on function
  target[functionName].calls = spy.calls;

  return spy;
}
