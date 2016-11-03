import { TestLoader } from "../../../../core/test-loader";
import { FileRequirer } from "../../../../core/file-requirer";
import { Expect, Test, TestCase, SpyOn, METADATA_KEYS } from "../../../../core/alsatian-core";
import "reflect-metadata";

export class MultipleExportedFixtureTests {

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public shouldContainCorrectNumberOfTestFixtures(expectedTestFixtureCount: number) {

      const fileRequirer = new FileRequirer();

      const testFixtureInstance = {};
      Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

      const testFixtureConstructor = () => testFixtureInstance;

      const testFixtureWrapper = {};
      for (let i = 0; i < expectedTestFixtureCount; i++) {
         testFixtureWrapper["TestFixture" + i] = testFixtureConstructor;
      }

      const spy = SpyOn(fileRequirer, "require");
      spy.andStub();
      spy.andReturn(testFixtureWrapper);

      const testLoader = new TestLoader(fileRequirer);

      Expect(testLoader.loadTestFixture("test").length).toBe(expectedTestFixtureCount);
   }

   @Test()
   public shouldIgnoreNonTestFixtureConstructorAtStartOfWrapper() {

      const fileRequirer = new FileRequirer();

      const testFixtureInstance = {};
      Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

      const testFixtureConstructor = () => testFixtureInstance;

      const testFixtureWrapper = {
         firstThing: () => {},
         secondThing: testFixtureConstructor,
         thirdThing: testFixtureConstructor
      };

      const spy = SpyOn(fileRequirer, "require");
      spy.andStub();
      spy.andReturn(testFixtureWrapper);

      const testLoader = new TestLoader(fileRequirer);

      Expect(testLoader.loadTestFixture("test").length).toBe(2);
   }

   @Test()
   public shouldIgnoreObjectAtStartOfWrapper() {

      const fileRequirer = new FileRequirer();

      const testFixtureInstance = {};
      Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

      const testFixtureConstructor = () => testFixtureInstance;

      const testFixtureWrapper = {
         firstThing: {},
         secondThing: testFixtureConstructor,
         thirdThing: testFixtureConstructor
      };

      const spy = SpyOn(fileRequirer, "require");
      spy.andStub();
      spy.andReturn(testFixtureWrapper);

      const testLoader = new TestLoader(fileRequirer);

      Expect(testLoader.loadTestFixture("test").length).toBe(2);
   }

   @Test()
   public shouldIgnoreNonTestFixtureConstructorInMiddleOfWrapper() {

      const fileRequirer = new FileRequirer();

      const testFixtureInstance = {};
      Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

      const testFixtureConstructor = () => testFixtureInstance;

      const testFixtureWrapper = {
         firstThing: testFixtureConstructor,
         secondThing: () => {},
         thirdThing: testFixtureConstructor
      };

      const spy = SpyOn(fileRequirer, "require");
      spy.andStub();
      spy.andReturn(testFixtureWrapper);

      const testLoader = new TestLoader(fileRequirer);

      Expect(testLoader.loadTestFixture("test").length).toBe(2);
   }

   @Test()
   public shouldIgnoreObjectInMiddleOfWrapper() {

      const fileRequirer = new FileRequirer();

      const testFixtureInstance = {};
      Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

      const testFixtureConstructor = () => testFixtureInstance;

      const testFixtureWrapper = {
         firstThing: testFixtureConstructor,
         secondThing: {},
         thirdThing: testFixtureConstructor
      };

      const spy = SpyOn(fileRequirer, "require");
      spy.andStub();
      spy.andReturn(testFixtureWrapper);

      const testLoader = new TestLoader(fileRequirer);

      Expect(testLoader.loadTestFixture("test").length).toBe(2);
   }

   @Test()
   public shouldIgnoreNonTestFixtureConstructorAtEndOfWrapper() {

      const fileRequirer = new FileRequirer();

      const testFixtureInstance = {};
      Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

      const testFixtureConstructor = () => testFixtureInstance;

      const testFixtureWrapper = {
         firstThing: testFixtureConstructor,
         secondThing: testFixtureConstructor,
         thirdThing: () => {}
      };

      const spy = SpyOn(fileRequirer, "require");
      spy.andStub();
      spy.andReturn(testFixtureWrapper);

      const testLoader = new TestLoader(fileRequirer);

      Expect(testLoader.loadTestFixture("test").length).toBe(2);
   }

   @Test()
   public shouldIgnoreObjectAtEndOfWrapper() {

      const fileRequirer = new FileRequirer();

      const testFixtureInstance = {};
      Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

      const testFixtureConstructor = () => testFixtureInstance;

      const testFixtureWrapper = {
         firstThing: testFixtureConstructor,
         secondThing: testFixtureConstructor,
         thirdThing: () => {}
      };

      const spy = SpyOn(fileRequirer, "require");
      spy.andStub();
      spy.andReturn(testFixtureWrapper);

      const testLoader = new TestLoader(fileRequirer);

      Expect(testLoader.loadTestFixture("test").length).toBe(2);
   }
}
