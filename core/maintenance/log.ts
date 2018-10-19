function getStack() {
  return new Error().stack.split("\n").map(stackLine => {
    const STACK_ITEMS = stackLine
      .replace(/^\s*at (.+) \((.+):\d+:\d+\)$/, "$1 $2")
      .split(" ");

    return {
      functionName: STACK_ITEMS[0],
      filePath: STACK_ITEMS[1]
    };
  });
}

export class Logger {
  public static log(value: string) {
    Logger.LOGS.push({
      value,
      stack: getStack()
    });
  }

  private static readonly LOGS: Array<any> = [];
}
