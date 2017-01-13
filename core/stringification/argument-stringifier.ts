import { Any, TypeMatcher } from "../spying";

export class ArgumentStringifier {

    public stringifyArguments(args: Array<any>): string {
        return `[${args.map(this.stringifyArgument).join(", ")}]`;
    }

    public stringifyArgument(arg: any): string {
        if (arg === Any) {
            return "Anything";
        }
        else if (arg instanceof TypeMatcher) {
            return "Any " + (arg.type as any).name;
        }
        else {
            return JSON.stringify(arg);
        }
    }
}