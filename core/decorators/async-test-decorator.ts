import "reflect-metadata";

export function AsyncTest(description?: string) {
   return  (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any/*Promise<void>*/>) => {

      // check if this has been registered as a test already
      let tests: Array<any> = Reflect.getMetadata("alsatian:tests", target);

      // if there are no tests registered yet then register it
      if (!tests) {
         tests = [ {
            key: propertyKey
         } ];
         Reflect.defineMetadata("alsatian:tests", tests, target);
      }
      // otherwise add it to the register if it's not already there
      else if (tests.filter(test => test.key === propertyKey).length === 0) {
         tests.push( {
            key: propertyKey
         } );
         Reflect.defineMetadata("alsatian:tests", tests, target);
      }

      // mark it as async and add the description
      let test = tests.filter(test => test.key === propertyKey)[0];
      test.isAsync = true;
      test.description = description;
   };
}
