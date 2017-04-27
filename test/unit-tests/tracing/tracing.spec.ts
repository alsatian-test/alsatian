import {
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

}
