import { TestLoader } from "../../../core/test-loader";
import { FileRequirer } from "../../../core/file-requirer";
import { Expect, Test, TestCase, TestFixture, SpyOn, METADATA_KEYS } from "../../../core/alsatian-core";
import { TestBuilder } from "../../builders/test-builder";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { TestCaseBuilder } from "../../builders/test-case-builder";
import { TestFixture as TestFixtureMetadata } from "../../../core/";
import "reflect-metadata";

@TestFixture("Load Tests")
export class LoadTestTests {

   @Test()
   public ignoredShouldBeFalseByDefault() {

     let fileRequirer = new FileRequirer();

     let testFixtureInstance = {};
     Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

     let testFixtureSet = {
        testFixture: () => testFixtureInstance
     };

     let spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureSet);

     let testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].ignored).toBe(false);
   }

   @Test()
   public ignoredShouldBeTrueIfMetadataSet() {

     let fileRequirer = new FileRequirer();

      let testFixtureInstance = {};
      Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

      let testFixtureSet = {
         testFixture: () => testFixtureInstance
      };

     Reflect.defineMetadata(METADATA_KEYS.IGNORE, true,  testFixtureSet.testFixture);

     let spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureSet);

     let testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].ignored).toBe(true);
   }

   @TestCase("first reason")
   @TestCase("the second, and the last")
   public ignoreReasonShouldBeSetFromMetadata(reason: string) {

     let fileRequirer = new FileRequirer();

      let testFixtureInstance = {};
      Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

      let testFixtureSet = {
         testFixture: () => testFixtureInstance
      };

     Reflect.defineMetadata(METADATA_KEYS.IGNORE, true,  testFixtureSet.testFixture);
     Reflect.defineMetadata(METADATA_KEYS.IGNORE_REASON, reason, testFixtureSet.testFixture);

     let spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureSet);

     let testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].ignoreReason).toBe(reason);
   }

   @Test()
   public focussedShouldBeFalseByDefault() {

     let fileRequirer = new FileRequirer();

     let testFixtureInstance = {};
     Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

     let testFixtureSet = {
        testFixture: () => testFixtureInstance
     };

     let spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureSet);

     let testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].focussed).toBe(false);
   }

   @Test()
   public focussedShouldBeTrueIfMetadataSet() {

     let fileRequirer = new FileRequirer();

      let testFixtureInstance = {};
      Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

      let testFixtureSet = {
         testFixture: () => testFixtureInstance
      };

     Reflect.defineMetadata(METADATA_KEYS.FOCUS, true,  testFixtureSet.testFixture);

     let spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureSet);

     let testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].focussed).toBe(true);
   }

   @Test()
   public noTestsReturnsEmptyArray() {

     let fileRequirer = new FileRequirer();

      let testFixtureInstance = {};

      let testFixtureSet = {
         testFixture: () => testFixtureInstance
      };

     let spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureSet);

     let testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test").length).toBe(0);
   }

   @Test()
   public descriptionShouldBeSetWhenNotConstructor() {
       let fileRequirer = new FileRequirer();

       let testFixtureInstance = {};
       Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

       let testFixtureSet = {
          testFixture: () => testFixtureInstance
       };

       let spy = SpyOn(fileRequirer, "require");
       spy.andStub();
       spy.andReturn(testFixtureSet);

       let testLoader = new TestLoader(fileRequirer);
       Expect(testLoader.loadTestFixture("test")[0].description).toBe("testFixture");
   }

   @Test()
   public descriptionShouldBeSetWhenConstructor() {
       let fileRequirer = new FileRequirer();

       let testFixtureInstance = {};
       Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

       let testFixtureSet = function testFixture() {
           return testFixtureInstance;
       };

       let spy = SpyOn(fileRequirer, "require");
       spy.andStub();
       spy.andReturn(testFixtureSet);

       let testLoader = new TestLoader(fileRequirer);

       Expect(testLoader.loadTestFixture("test")[0].description).toBe("testFixture");
   }

   @TestCase("something")
   @TestCase("wow, this is super!")
   @TestCase("Mega Hyper AWESOME test...")
   public descriptionShouldBeSetWhenMetadataOnDefault(testFixtureDescription: string) {
       let fileRequirer = new FileRequirer();

       let testFixtureInstance = {};
       Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

       let testFixtureSet = function testFixture() {
           return testFixtureInstance;
       };

       const testFixtureMetadata = new TestFixtureMetadata(testFixtureDescription);
       Reflect.defineMetadata(METADATA_KEYS.TEST_FIXTURE, testFixtureMetadata, testFixtureSet);

       let spy = SpyOn(fileRequirer, "require");
       spy.andStub();
       spy.andReturn(testFixtureSet);

       let testLoader = new TestLoader(fileRequirer);

       Expect(testLoader.loadTestFixture("test")[0].description).toBe(testFixtureDescription);
   }

   @TestCase("something")
   @TestCase("wow, this is super!")
   @TestCase("Mega Hyper AWESOME test...")
   public descriptionShouldBeSetWhenMetadataOnExportedMember(testFixtureDescription: string) {
       let fileRequirer = new FileRequirer();

       let testFixtureInstance = {};
       Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

       let testFixtureSet = {
          testFixture: () => testFixtureInstance
       };

       const testFixtureMetadata = new TestFixtureMetadata(testFixtureDescription);
       Reflect.defineMetadata(METADATA_KEYS.TEST_FIXTURE, testFixtureMetadata, testFixtureSet.testFixture);

       let spy = SpyOn(fileRequirer, "require");
       spy.andStub();
       spy.andReturn(testFixtureSet);

       let testLoader = new TestLoader(fileRequirer);

       Expect(testLoader.loadTestFixture("test")[0].description).toBe(testFixtureDescription);
   }

   public shouldIgnoreTestsIfFixtureIgnored() {
       let fileRequirer = new FileRequirer();

       let testOne = new TestBuilder()
        .withKey("testOne")
        .addTestCase(new TestCaseBuilder().build())
        .build();

        let testTwo = new TestBuilder()
         .withKey("testTwo")
         .addTestCase(new TestCaseBuilder().build())
         .build();

        let fixture = new TestFixtureBuilder()
            .addTest(testOne)
            .addTest(testTwo)
            .build();

       let testFixtureSet = {
           testFixture: () => fixture
       };
       Reflect.defineMetadata(METADATA_KEYS.IGNORE, true, testFixtureSet.testFixture);
       Reflect.defineMetadata(METADATA_KEYS.TESTS, [testOne, testTwo], fixture);

       let spy = SpyOn(fileRequirer, "require");
       spy.andStub();
       spy.andReturn(testFixtureSet);

       let testLoader = new TestLoader(fileRequirer);

       let loadedFixture = testLoader.loadTestFixture("")[0]; // get the first (only) loaded fixture

       Expect(loadedFixture.tests[0].ignored).toBe(true);
       Expect(loadedFixture.tests[1].ignored).toBe(true);
   }

   @TestCase("first test ignore reason")
   @TestCase("another one!")
   public shouldIgnoreTestsWithReasonIfFixtureIgnored(reason: string) {
       let fileRequirer = new FileRequirer();

       let testOne = new TestBuilder()
        .withKey("testOne")
        .addTestCase(new TestCaseBuilder().build())
        .build();

        let testTwo = new TestBuilder()
         .withKey("testTwo")
         .addTestCase(new TestCaseBuilder().build())
         .build();

        let fixture = new TestFixtureBuilder()
            .addTest(testOne)
            .addTest(testTwo)
            .build();

       let testFixtureSet = {
           testFixture: () => fixture
       };
       Reflect.defineMetadata(METADATA_KEYS.IGNORE, true, testFixtureSet.testFixture);
       Reflect.defineMetadata(METADATA_KEYS.IGNORE_REASON, reason, testFixtureSet.testFixture);
       Reflect.defineMetadata(METADATA_KEYS.TESTS, [testOne, testTwo], fixture);

       let spy = SpyOn(fileRequirer, "require");
       spy.andStub();
       spy.andReturn(testFixtureSet);

       let testLoader = new TestLoader(fileRequirer);

       let loadedFixture = testLoader.loadTestFixture("")[0]; // get the first (only) loaded fixture

       Expect(loadedFixture.tests[0].ignoreReason).toBe(reason);
       Expect(loadedFixture.tests[1].ignoreReason).toBe(reason);
   }
 }
