import { AsyncTest, Expect, Test, TestFixture } from "alsatian";

@TestFixture("error throwing")
export class ErrorThrow {

    @Test()
    errorThrown() {
        const errorFunction = () => { throw new Error("error"); };

        Expect(errorFunction).toThrow();
    }

    @Test()
    noErrorThrown() {
        const errorFunction = () => {  };

        Expect(errorFunction).not.toThrow();
    }

    @Test()
    exactErrorThrown() {

        const errorFunction = () => { throw new TypeError("specific error"); };

        Expect(errorFunction).toThrowError(TypeError, "specific error");
    }

    @Test()
    notExactErrorThrown() {
        const errorFunction = () => { throw new Error("any old error"); };

        Expect(errorFunction).not.toThrowError(TypeError, "specific error");
    }

    @AsyncTest()
    async asyncErrorThrown() {
        const errorFunction = () => { return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error("error")), 400);
        });
        };

        await Expect(errorFunction).toThrowAsync();
    }

    @AsyncTest()
    async asyncNoErrorThrown() {
        const errorFunction = () => { return new Promise((resolve) => {
            setTimeout(resolve, 400);
        });
        };

        await Expect(errorFunction).not.toThrowAsync();
    }

    @AsyncTest()
    async asnycExactErrorThrown() {
        const errorFunction = () => { return new Promise((resolve, reject) => {
            setTimeout(() => reject(new TypeError("specific error")), 400);
        });
        };

        await Expect(errorFunction).toThrowErrorAsync(TypeError, "specific error");
    }

    @AsyncTest()
    async asyncNotExactErrorThrown() {
        const errorFunction = () => { return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error("any old error")), 400);
        });
        };

        await Expect(errorFunction).not.toThrowErrorAsync(TypeError, "specific error");
    }
}