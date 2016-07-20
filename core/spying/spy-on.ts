import {
    SpyCall,
    RestorableSpy
} from "../_spying";

export function SpyOn(target: any, functionName: string): RestorableSpy {

  let spy = new RestorableSpy(target, functionName);

  target[functionName] = (...args: Array<any>) => {
    return spy.call(args);
  };

  // expose spy's calls on function
  target[functionName].calls = spy.calls;

  // expose spy's restore function
  target[functionName].restore = spy.restore.bind(spy);

  return spy;
}
