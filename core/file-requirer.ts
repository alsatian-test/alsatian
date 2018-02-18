/**
 * This class is responsible for require files
 */
export class FileRequirer {
  /**
   * Require a file using the node require function
   * @param requirePath The path of the file to load
   */
  public require(requirePath: string): any {
    return require(requirePath);
  }
}
