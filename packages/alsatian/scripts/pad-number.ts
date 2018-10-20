let zeroCache = "0000000000";

export function padNumber(
  originalNumber: number,
  minimumIntegerLength: number
) {
  if (zeroCache.length < minimumIntegerLength) {
    zeroCache = new Array(minimumIntegerLength + 1).join("0");
  }

  const absoluteNumber = Math.abs(originalNumber);

  const integerLength = Math.trunc(absoluteNumber).toString().length;

  if (integerLength >= minimumIntegerLength) {
    return originalNumber.toString();
  }

  const numberString =
    zeroCache.slice(0, minimumIntegerLength - integerLength) +
    absoluteNumber.toString();

  if (originalNumber < 0) {
    return "-" + numberString;
  }

  return numberString;
}
