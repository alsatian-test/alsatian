import { AsyncTest, Expect, Test, TestFixture } from "alsatian";

@TestFixture("error throwing")
export class ErrorThrow {
  @Test()
  public errorThrown() {
    const errorFunction = () => {
      throw new Error("error");
    };

    Expect(errorFunction).toThrow();
  }

  @Test()
  public errorNotThrown() {
    const errorFunction = () => {};

    Expect(errorFunction).toThrow();
  }

  @Test()
  public noErrorThrown() {
    const errorFunction = () => {};

    Expect(errorFunction).not.toThrow();
  }

  @Test()
  public errorUnexpectedlyThrown() {
    const errorFunction = () => {
      throw new Error("error");
    };

    Expect(errorFunction).not.toThrow();
  }

  @Test()
  public exactErrorThrown() {
    const errorFunction = () => {
      throw new TypeError("specific error");
    };

    Expect(errorFunction).toThrowError(TypeError, "specific error");
  }

  @Test()
  public exactErrorNotThrown() {
    const errorFunction = () => {
      throw new Error("any old error");
    };

    Expect(errorFunction).toThrowError(TypeError, "specific error");
  }

  @Test()
  public notExactErrorThrown() {
    const errorFunction = () => {
      throw new Error("any old error");
    };

    Expect(errorFunction).not.toThrowError(TypeError, "specific error");
  }

  @Test()
  public exactErrorThrownUnexpectedly() {
    const errorFunction = () => {
      throw new TypeError("specific error");
    };

    Expect(errorFunction).not.toThrowError(TypeError, "specific error");
  }

  @AsyncTest()
  public async asyncErrorThrown() {
    const errorFunction = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("error")), 400);
      });
    };

    await Expect(errorFunction).toThrowAsync();
  }

  @AsyncTest()
  public async asyncErrorNotThrown() {
    const errorFunction = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 400);
      });
    };

    await Expect(errorFunction).toThrowAsync();
  }

  @AsyncTest()
  public async asyncNoErrorThrown() {
    const errorFunction = async () => {
      return new Promise(resolve => {
        setTimeout(resolve, 400);
      });
    };

    await Expect(errorFunction).not.toThrowAsync();
  }

  @AsyncTest()
  public async asyncErrorUnexpectedly() {
    const errorFunction = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("error")), 400);
      });
    };

    await Expect(errorFunction).not.toThrowAsync();
  }

  @AsyncTest()
  public async asnycExactErrorThrown() {
    const errorFunction = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject(new TypeError("specific error")), 400);
      });
    };

    await Expect(errorFunction).toThrowErrorAsync(TypeError, "specific error");
  }

  @AsyncTest()
  public async asnycExactErrorNotThrown() {
    const errorFunction = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("error")), 400);
      });
    };

    await Expect(errorFunction).toThrowErrorAsync(TypeError, "specific error");
  }

  @AsyncTest()
  public async asyncNotExactErrorThrown() {
    const errorFunction = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("any old error")), 400);
      });
    };

    await Expect(errorFunction).not.toThrowErrorAsync(
      TypeError,
      "specific error"
    );
  }

  @AsyncTest()
  public async asyncExactErrorThrownUnexpectedly() {
    const errorFunction = async () => {
      return new Promise((resolve, reject) => {
        reject(new TypeError("specific error"));
      });
    };

    await Expect(errorFunction).not.toThrowErrorAsync(
      TypeError,
      "specific error"
    );
  }
}
