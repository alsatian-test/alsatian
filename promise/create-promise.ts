export function createPromise(): any {
   let promise: any = {
     resolve: (...args: Array<any>) => {
        try {
          if (promise.resolveCallback) {
             promise.resolveCallback.apply(this, args);
          }
       }
       catch (error) {
          promise.reject(error);
       }
     },
      reject: (error: Error) => {
         if (promise.rejectCallback) {
            promise.rejectCallback(error);
         }
      },
     then: (callback: (testResults: Array<any>) => any) => {
       promise.resolveCallback = callback;
       return promise;
     },
     catch: (callback: (error: Error) => any) => {
        promise.rejectCallback = callback;
        return promise;
     }
  };

  return promise;
}
