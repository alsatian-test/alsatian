import "reflect-metadata";
import { TestFixture as TestFixtureMetadata } from "../";
import { TEST_FIXTURE } from "./_metadata-keys";
import { Constructor, INameable } from "../_interfaces";

export function TestFixture(description?: string) {
  return (constructor: Constructor) => {
    // create data about the test fixture
    // with the description either being the
    // given string or the class name
    const testFixtureMetadata = new TestFixtureMetadata(
      description || (constructor as INameable).name
    );

    // attach meta data to the class
    Reflect.defineMetadata(TEST_FIXTURE, testFixtureMetadata, constructor);
  };
}
