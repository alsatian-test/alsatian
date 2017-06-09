import { Constructor } from "../../core/_interfaces";

export class ClassBuilder {

  private name: string;

  public ClassBuilder() {
    this.name = "SomeClass";
  }

  public withName(name: string): ClassBuilder {
    this.name = name;
    return this;
  }

  public build(): Constructor {
    class BuiltClass { }

    Object.defineProperty(BuiltClass, "name", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: this.name
    });

    return BuiltClass;
  }

}
