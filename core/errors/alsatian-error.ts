export class AlsatianError implements Error {

    private _message: string = null;
    public get message(): string {
        return this._message;
    }
    public set message(message: string) {
        this._message = message;
    }

    public get name(): string {
        return "";
    }

    public constructor(message?: string) {
        this._message = message;
        (<any>Object).setPrototypeOf(AlsatianError.prototype, Error.prototype);
    }
}