import {
   AsyncTest,
   Expect,
   SpyOn,
   SpyOnProperty,
   Test,
   TestCase,
   TestCaseResult,
   TestOutputStream
} from "../../../core/alsatian-core";
import { TraceLocation, TraceMarker } from "../../../core/tracing";

export class TracingTests {

   @Test()
   public testTracing() {
      let location: TraceLocation = TraceMarker.here();

      Expect(location.toString()).toBe(`at ${location.func} (${location.file}:${location.line}:${location.col}`);
   }

   @Test()
   public testTraceMarkerEmpty() {
      let emptyLocation = new TraceLocation();
      let emptyMarker =  new TraceMarker();

      let location = emptyMarker.getLocation();
      Expect(location.file).toBe(emptyLocation.file);
      Expect(location.func).toBe(emptyLocation.func);
      Expect(location.line).toBe(emptyLocation.line);
      Expect(location.col).toBe(emptyLocation.col);
   }

   @Test()
   public testTraceMarkerShortStack() {
      let emptyLocation = new TraceLocation();
      let marker = new TraceMarker().mark();
      SpyOnProperty(marker, "_stackState").andReturnValue("Error");
      let location = marker.getLocation();
      Expect(location.file).toBe(emptyLocation.file);
      Expect(location.func).toBe(emptyLocation.func);
      Expect(location.line).toBe(emptyLocation.line);
      Expect(location.col).toBe(emptyLocation.col);
   }

   @Test()
   public testTraceMarkerNotEnoughFieldsInStack() {
      let emptyLocation = new TraceLocation();
      let marker = new TraceMarker().mark();
      SpyOnProperty(marker, "_stackState").andReturnValue("Error\n  at aFunc (/xyz/file.xx:12)");
      let location = marker.getLocation();
      Expect(location.file).toBe(emptyLocation.file);
      Expect(location.func).toBe(emptyLocation.func);
      Expect(location.line).toBe(emptyLocation.line);
      Expect(location.col).toBe(emptyLocation.col);
   }

   private async _asyncFunction(notA5: number): Promise<void> {
      Expect(notA5).not.toBe(5);
      return new Promise<void>(() => {
         Expect(notA5).toBe(5);
      });
   }

   @AsyncTest("test getLocation anonymous function path")
   public async failingAsyncTestPasses() {
      try {
         await this._asyncFunction(4);
         Expect("failingAsyncTestPasses: Failed, expected an error to be thrown it wasn't").not.toBeTruthy();
      } catch (err) {
         Expect(`failingAsyncTestPasses: Success, caught expected err=${err}`).toBeTruthy();
      }
   }

}
