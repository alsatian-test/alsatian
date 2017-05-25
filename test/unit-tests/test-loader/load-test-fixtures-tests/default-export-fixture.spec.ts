import "reflect-metadata";
import { Expect, METADATA_KEYS, SpyOn, Test } from "../../../../core/alsatian-core";
import { FileRequirer } from "../../../../core/file-requirer";
import { TestLoader } from "../../../../core/test-loader";

export class DefaultExportFixtureTests {

   @Test()
   public ignoredShouldBeFalseByDefault() {

     const fileRequirer = new FileRequirer();

     const testFixtureInstance = {};
     Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

     const testFixtureConstructor = () => testFixtureInstance;

     const spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureConstructor);

     const testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].ignored).toBe(false);
   }

   @Test()
   public ignoredShouldBeTrueIfMetadataSet() {

     const fileRequirer = new FileRequirer();

     const testFixtureInstance = {};
     Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

     const testFixtureConstructor = () => testFixtureInstance;

     Reflect.defineMetadata(METADATA_KEYS.IGNORE, true,  testFixtureConstructor);

     const spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureConstructor);

     const testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].ignored).toBe(true);
   }

   @Test()
   public focussedShouldBeFalseByDefault() {

     const fileRequirer = new FileRequirer();

     const testFixtureInstance = {};
     Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

     const testFixtureConstructor = () => testFixtureInstance;

     const spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureConstructor);

     const testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].focussed).toBe(false);
   }

   @Test()
   public focussedShouldBeTrueIfMetadataSet() {

     const fileRequirer = new FileRequirer();

     const testFixtureInstance = {};
     Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

     const testFixtureConstructor = () => testFixtureInstance;

     Reflect.defineMetadata(METADATA_KEYS.FOCUS, true,  testFixtureConstructor);

     const spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureConstructor);

     const testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].focussed).toBe(true);
   }

   @Test()
   public noTestsReturnsEmptyArray() {

     const fileRequirer = new FileRequirer();

     const testFixtureInstance = {};

     const testFixtureConstructor = () => testFixtureInstance;

     const spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureConstructor);

     const testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test").length).toBe(0);
   }
 }
