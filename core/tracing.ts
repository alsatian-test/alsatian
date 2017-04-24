require('source-map-support').install();

export class TraceLocation {
    public func: string;
    public file: string;
    public line: number;
    public col:  number;

    public constructor() {
        this.file = "<no info>";
        this.func = "<no info>";
        this.line = -1;
        this.col  = -1;
    }

    public toString(): string {
        return `at ${this.func} (${this.file}:${this.line}:${this.col}`;
    }
}

export class TraceMarker {
    private _stackState: string;

    /**
     * Return the location of where this routine was called from
     */
    public static here(callDepth = 1): TraceLocation {
        let tm = new TraceMarker();
        return tm.mark(callDepth).getLocation();
    }

    /**
     * Constructor
     */
    public constructor() {
    }

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
        //console.log(`${err.stack}`);
        this._stackState = err.stack;
        return this;
    }


    /**
     * Return the TraceLocation
     *
     */
    public getLocation(): TraceLocation {
        //console.log(`${this.stackState}`);
        let stack = this._stackState.split("\n");
        let location = new TraceLocation();
        if (stack.length >= 2) {
            //console.log(`stack[tos]=${stack[stack.length - 1]}`);
            let r = /.*? at (.*?) \((.*?):(\d+):(\d+)\)/.exec(`${stack[stack.length - 1]}`);
            //console.log(`r=${r}`);
            if (r.length > 2) {
                location.file = r[2];
            }
            if (r.length > 1) {
                location.func = r[1];
            }
            if (r.length > 3) {
                location.line = Number(r[3]);
            }
            if (r.length > 4) {
                location.col = Number(r[4]);
            }
        }
        return location;
    }
}
