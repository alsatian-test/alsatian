import "reflect-metadata";
import { TestFixture as TestFixtureMetadata } from "../../../core/";
import {
    Expect,
    METADATA_KEYS,
    SpyOn,
    SpyOnProperty,
    Test,
    TestCase,
    TestFixture,
    Setup,
    Teardown
} from "../../../core/alsatian-core";
import { FileRequirer } from "../../../core/file-requirer";
import { TestLoader } from "../../../core/test-loader";
import { TestBuilder } from "../../builders/test-builder";
import { TestCaseBuilder } from "../../builders/test-case-builder";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";

@TestFixture("Load Tests")
export class LoadTestTests {

   private _originalStdErr: (message: string) => boolean;

   @Setup
   private _spyOnProcess() {
     this._originalStdErr = process.stderr.write;
     SpyOn(process.stderr, "write").andStub();
   }

   @Teardown
   private _resetProcess() {
     process.stderr.write = this._originalStdErr;
   }

   @Test()
   public ignoredShouldBeFalseByDefault() {

     const fileRequirer = new FileRequirer();

     const testFixtureInstance = {};
     Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

     const testFixtureSet = {
        testFixture: () => testFixtureInstance
     };

     const spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureSet);

     const testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].ignored).toBe(false);
   }

   @Test()
   public ignoredShouldBeTrueIfMetadataSet() {

     const fileRequirer = new FileRequirer();

     const testFixtureInstance = {};
     Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

     const testFixtureSet = {
         testFixture: () => testFixtureInstance
     };

     Reflect.defineMetadata(METADATA_KEYS.IGNORE, true,  testFixtureSet.testFixture);

     const spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureSet);

     const testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].ignored).toBe(true);
   }

   @TestCase("first reason")
   @TestCase("the second, and the last")
   public ignoreReasonShouldBeSetFromMetadata(reason: string) {

     const fileRequirer = new FileRequirer();

     const testFixtureInstance = {};
     Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

     const testFixtureSet = {
         testFixture: () => testFixtureInstance
     };

     Reflect.defineMetadata(METADATA_KEYS.IGNORE, true,  testFixtureSet.testFixture);
     Reflect.defineMetadata(METADATA_KEYS.IGNORE_REASON, reason, testFixtureSet.testFixture);

     const spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureSet);

     const testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].ignoreReason).toBe(reason);
   }

   @Test()
   public focussedShouldBeFalseByDefault() {

     const fileRequirer = new FileRequirer();

     const testFixtureInstance = {};
     Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

     const testFixtureSet = {
        testFixture: () => testFixtureInstance
     };

     const spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureSet);

     const testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].focussed).toBe(false);
   }

   @Test()
   public focussedShouldBeTrueIfMetadataSet() {

     const fileRequirer = new FileRequirer();

     const testFixtureInstance = {};
     Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

     const testFixtureSet = {
         testFixture: () => testFixtureInstance
     };

     Reflect.defineMetadata(METADATA_KEYS.FOCUS, true,  testFixtureSet.testFixture);

     const spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureSet);

     const testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].focussed).toBe(true);
   }

   @Test()
   public noTestsReturnsEmptyArray() {

     const fileRequirer = new FileRequirer();

     const testFixtureInstance = {};

     const testFixtureSet = {
         testFixture: () => testFixtureInstance
     };

     const spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureSet);

     const testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test").length).toBe(0);
   }

   @TestCase("something")
   @TestCase("wow, this is super!")
   @TestCase("Mega Hyper AWESOME test...")
   public descriptionShouldBeSetWhenNotConstructor(propertyName: string) {
       const fileRequirer = new FileRequirer();

       const testFixtureInstance = {};
       Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

       const testFixtureSet: { [propertyName: string]: () => any } = {};

       testFixtureSet[propertyName] = () => testFixtureInstance;

       const spy = SpyOn(fileRequirer, "require");
       spy.andStub();
       spy.andReturn(testFixtureSet);

       const testLoader = new TestLoader(fileRequirer);
       Expect(testLoader.loadTestFixture("test")[0].description).toBe(propertyName);
   }

   @TestCase("something")
   @TestCase("wow, this is super!")
   @TestCase("Mega Hyper AWESOME test...")
   public descriptionShouldBeSetToConstructorNameWhenConstructor(constructorName: string) {
       const fileRequirer = new FileRequirer();

       const testFixtureInstance = {};
       Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

       const testFixtureSet = () => testFixtureInstance;
       SpyOnProperty(testFixtureSet, "name").andReturnValue(constructorName);

       const spy = SpyOn(fileRequirer, "require");
       spy.andStub();
       spy.andReturn(testFixtureSet);

       const testLoader = new TestLoader(fileRequirer);

       Expect(testLoader.loadTestFixture("test")[0].description).toBe(constructorName);
   }

   @TestCase("something")
   @TestCase("wow, this is super!")
   @TestCase("Mega Hyper AWESOME test...")
   public descriptionShouldBeSetWhenMetadataOnDefault(testFixtureDescription: string) {
       const fileRequirer = new FileRequirer();

       const testFixtureInstance = {};
       Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

       const testFixtureSet = () => testFixtureInstance;

       const testFixtureMetadata = new TestFixtureMetadata(testFixtureDescription);
       Reflect.defineMetadata(METADATA_KEYS.TEST_FIXTURE, testFixtureMetadata, testFixtureSet);

       const spy = SpyOn(fileRequirer, "require");
       spy.andStub();
       spy.andReturn(testFixtureSet);

       const testLoader = new TestLoader(fileRequirer);

       Expect(testLoader.loadTestFixture("test")[0].description).toBe(testFixtureDescription);
   }

   @TestCase("something")
   @TestCase("wow, this is super!")
   @TestCase("Mega Hyper AWESOME test...")
   public descriptionShouldBeSetWhenMetadataOnExportedMember(testFixtureDescription: string) {
       const fileRequirer = new FileRequirer();

       const testFixtureInstance = {};
       Reflect.defineMetadata(METADATA_KEYS.TESTS, [], testFixtureInstance);

       const testFixtureSet = {
          testFixture: () => testFixtureInstance
       };

       const testFixtureMetadata = new TestFixtureMetadata(testFixtureDescription);
       Reflect.defineMetadata(METADATA_KEYS.TEST_FIXTURE, testFixtureMetadata, testFixtureSet.testFixture);

       const spy = SpyOn(fileRequirer, "require");
       spy.andStub();
       spy.andReturn(testFixtureSet);

       const testLoader = new TestLoader(fileRequirer);

       Expect(testLoader.loadTestFixture("test")[0].description).toBe(testFixtureDescription);
   }

   public shouldIgnoreTestsIfFixtureIgnored() {
       const fileRequirer = new FileRequirer();

       const testOne = new TestBuilder()
        .withKey("testOne")
        .addTestCase(new TestCaseBuilder().build())
        .build();

       const testTwo = new TestBuilder()
         .withKey("testTwo")
         .addTestCase(new TestCaseBuilder().build())
         .build();

       const fixture = new TestFixtureBuilder()
            .addTest(testOne)
            .addTest(testTwo)
            .build();

       const testFixtureSet = {
           testFixture: () => fixture
       };

       Reflect.defineMetadata(METADATA_KEYS.IGNORE, true, testFixtureSet.testFixture);
       Reflect.defineMetadata(METADATA_KEYS.TESTS, [testOne, testTwo], fixture);

       const spy = SpyOn(fileRequirer, "require");
       spy.andStub();
       spy.andReturn(testFixtureSet);

       const testLoader = new TestLoader(fileRequirer);

       const loadedFixture = testLoader.loadTestFixture("")[0]; // get the first (only) loaded fixture

       Expect(loadedFixture.tests[0].ignored).toBe(true);
       Expect(loadedFixture.tests[1].ignored).toBe(true);
   }

   @TestCase("first test ignore reason")
   @TestCase("another one!")
   public shouldIgnoreTestsWithReasonIfFixtureIgnored(reason: string) {
       const fileRequirer = new FileRequirer();

       const testOne = new TestBuilder()
        .withKey("testOne")
        .addTestCase(new TestCaseBuilder().build())
        .build();

       const testTwo = new TestBuilder()
         .withKey("testTwo")
         .addTestCase(new TestCaseBuilder().build())
         .build();

       const fixture = new TestFixtureBuilder()
            .addTest(testOne)
            .addTest(testTwo)
            .build();

       const testFixtureSet = {
           testFixture: () => fixture
       };

       Reflect.defineMetadata(METADATA_KEYS.IGNORE, true, testFixtureSet.testFixture);
       Reflect.defineMetadata(METADATA_KEYS.IGNORE_REASON, reason, testFixtureSet.testFixture);
       Reflect.defineMetadata(METADATA_KEYS.TESTS, [testOne, testTwo], fixture);

       const spy = SpyOn(fileRequirer, "require");
       spy.andStub();
       spy.andReturn(testFixtureSet);

       const testLoader = new TestLoader(fileRequirer);

       const loadedFixture = testLoader.loadTestFixture("")[0]; // get the first (only) loaded fixture

       Expect(loadedFixture.tests[0].ignoreReason).toBe(reason);
       Expect(loadedFixture.tests[1].ignoreReason).toBe(reason);
   }

   @TestCase("/path/", "stack_trace")
   @TestCase("C:\\some_other\\path", "a-bad-error-trace")
   public shouldWriteToErrorLogWithCorrectMessage(path: string, stack: string) {
       const fileRequirer = new FileRequirer();

       const error = new Error("foo");
       error.stack = stack;

       const spy = SpyOn(fileRequirer, "require");
       spy.andStub();
       spy.andCall(() => {
           throw error;
       });

       const testLoader = new TestLoader(fileRequirer);

       testLoader.loadTestFixture(path);

       Expect(process.stderr.write).toHaveBeenCalledWith(`ERROR LOADING FILE: ${ path }\n`);
       Expect(process.stderr.write).toHaveBeenCalledWith(error.stack);
   }
 }
