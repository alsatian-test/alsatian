export class AlsatianCliOptions {

   private _fileGlobs: Array<string>;
   public get fileGlobs(): Array<string> {
      return this._fileGlobs;
   }

   private _timeout: number;
   public get timeout(): number {
      return this._timeout;
   }

   public constructor (args: Array<string>) {
      args.forEach((value, index) => {
         const nextArgument = args[index + 1];
         const previousArgument = args[index - 1];

         if (value[0] === "-") {
            const optionName = value.replace(/[-]*/, "");
            this[optionName] = true;
            if (nextArgument && nextArgument[0] !== "-") {
               this[optionName] = nextArgument;
            }
         }
         else if (nextArgument && nextArgument[0] !== "-") {
            this._fileGlobs.push(value);
         }
      });
   }
}
