import { ExtensionContext, Uri } from "vscode";

export class Icons {
    static getTestRunningIconPath(context: ExtensionContext) { 
        return Uri.file(context.asAbsolutePath("src/icons/running.svg"));
    }

    static getTestSuccessIconPath(context: ExtensionContext) { 
        return Uri.file(context.asAbsolutePath("src/icons/success.svg"));
    }

    static getTestFailureIconPath(context: ExtensionContext) { 
        return Uri.file(context.asAbsolutePath("src/icons/failure.svg"));
    }
}
