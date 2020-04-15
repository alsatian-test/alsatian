import { ExtensionContext, commands } from "vscode";

export abstract class AlsatianCommand {

    protected static commandName: string;

    public static readonly title: string;

    // ensure that commands can't be constructed by anything apart from themselves
    protected constructor() { }

    public static get details() {
        if (this.commandName === undefined) {
            throw new TypeError("name must be defined");
        }

        return {
            command: `alsatian.${this.commandName}`,
            title: this.title
        };
    }

    protected static async execute(...args: Array<any>) {
        throw new Error("not implemented");
    }

    public static setup(context: ExtensionContext) {
        context.subscriptions.push(
            commands.registerCommand(
                this.details.command,
                this.execute
            )
        );
    }
}

