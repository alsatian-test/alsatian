export abstract class ArgumentMatcher {
   public abstract test(value: any): boolean;
   public abstract stringify(): string;
}
