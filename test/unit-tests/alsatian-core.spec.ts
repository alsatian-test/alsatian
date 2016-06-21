import * as Alsatian from "../../core/alsatian-core";
import { Expect, Test, TestCase } from "../../core/alsatian-core";

export class AlsatianCoreTests {

   @Test()
   public expectShouldBeExposed() {
      Expect(Alsatian.Expect).toBeDefined();
      Expect(Alsatian.Expect).not.toBeNull();
   }

   @Test()
   public focusTestShouldBeExposed() {
      Expect(Alsatian.FocusTest).toBeDefined();
      Expect(Alsatian.FocusTest).not.toBeNull();
   }

   @Test()
   public focusTestsShouldBeExposed() {
      Expect(Alsatian.FocusTests).toBeDefined();
      Expect(Alsatian.FocusTests).not.toBeNull();
   }

   @Test()
   public ignoreTestShouldBeExposed() {
      Expect(Alsatian.IgnoreTest).toBeDefined();
      Expect(Alsatian.IgnoreTest).not.toBeNull();
   }

   @Test()
   public ignoreTestsShouldBeExposed() {
      Expect(Alsatian.IgnoreTests).toBeDefined();
      Expect(Alsatian.IgnoreTests).not.toBeNull();
   }

   @Test()
   public testShouldBeExposed() {
      Expect(Alsatian.Test).toBeDefined();
      Expect(Alsatian.Test).not.toBeNull();
   }

   @Test()
   public testCaseShouldBeExposed() {
      Expect(Alsatian.TestCase).toBeDefined();
      Expect(Alsatian.TestCase).not.toBeNull();
   }

   @Test()
   public testRunnerShouldBeExposed() {
      Expect(Alsatian.TestRunner).toBeDefined();
      Expect(Alsatian.TestRunner).not.toBeNull();
   }

   @Test()
   public spyOnShouldBeExposed() {
      Expect(Alsatian.SpyOn).toBeDefined();
      Expect(Alsatian.SpyOn).not.toBeNull();
   }

   @Test()
   public setupShouldBeExposed() {
      Expect(Alsatian.Setup).toBeDefined();
      Expect(Alsatian.Setup).not.toBeNull();
   }

   @Test()
   public teardownShouldBeExposed() {
      Expect(Alsatian.Teardown).toBeDefined();
      Expect(Alsatian.Teardown).not.toBeNull();
   }
}
