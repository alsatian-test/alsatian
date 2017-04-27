import { install } from "source-map-support";
install();

import * as path from "path";

export class TraceLocation {
   public func: string;
   public file: string;
   public line: number;
   public col: number;

   public constructor() {
      this.file = "";
      this.func = "";
      this.line = -1;
      this.col  = -1;
   }

   public toString(): string {
      return `at ${this.func} (${this.file}:${this.line}:${this.col}`;
   }
}

export class TraceMarker {
   /**
    * Return the location of where this routine was called from
    */
   public static here(callDepth = 0): TraceLocation {
      let tm = new TraceMarker();
      return tm.mark(1 + callDepth).getLocation();
   }

   private _stackState: string;

   /**
    * Mark the "current" location.
    *
    * @param callDepth is the call nesting if used directly no
    *        value is necessary and the default is 0. But if you
    *        use TraceMarker.mark in a subroutine and you want to
    *        mark where that subroutine was called from you need
    *        callDepth = 1 or the approprate value.
    */
   public mark(callDepth: number = 0): TraceMarker {
      let saveStackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = callDepth + 1;
      let err = new Error();
      Error.captureStackTrace(err, this.mark);
      Error.stackTraceLimit = saveStackTraceLimit;
      // console.log(`${err.stack}`);
      this._stackState = err.stack;
      return this;
   }

   /**
    * Return the TraceLocation
    *
    */
   public getLocation(): TraceLocation {
      // console.log(`${this.stackState}`);
      let location = new TraceLocation();
      if (this._stackState) {
         let stack = this._stackState.split("\n");
         if (stack.length >= 2) {
            // console.log(`stack[tos]=${stack[stack.length - 1]}`);
            let projectRoot = path.dirname(__dirname);

            // Check for non-anonymous function which means
            // location string is of the form; " at func (file:line:col)"
            let r = /.*? at (.*?) \((.*?):(\d+):(\d+)\)/.exec(`${stack[stack.length - 1]}`);
            if (r && r.length > 4) {
               let relative = path.relative(projectRoot, r[2]);
               // console.log(`__dirname=${__dirname} project_root=${project_root} relative=${relative}`);
               location.file = relative;
               location.func = r[1];
               location.line = Number(r[3]);
               location.col = Number(r[4]);
            } else {
               // Check for anonymous function which means location
               // string has no func and is of the form; " at file:line:col"
               r = /.*? at *(.*?):(\d+):(\d+)/.exec(`${stack[stack.length - 1]}`);
               if (r && r.length > 3) {
                  let relative = path.relative(projectRoot, r[1]);
                  location.file = relative;
                  location.func = "";
                  location.line = Number(r[2]);
                  location.col = Number(r[3]);
               }
            }
         }
      }
      return location;
   }

}
