import "reflect-metadata";
import { TestFixture as TestFixtureMetadata } from "../";
import { TEST_FIXTURE } from "./_metadata-keys";

export function TestFixture(description?: string) {

  return (constructor: ({ new (...args: Array<any>): any; }) | (() => any)) => {

    // create data about the test fixture
    // with the description either being the
    // given string or the class name
    const testFixtureMetadata = new TestFixtureMetadata(description || (constructor as any).name);

    // attach meta data to the class
    Reflect.defineMetadata(TEST_FIXTURE, testFixtureMetadata, constructor);
  };
}
