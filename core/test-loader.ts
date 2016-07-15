export class TestLoader {
  loadTestFromFilePath(filePath: string) {
    return require(filePath);
  }
}
