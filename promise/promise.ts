export class Promise<T> {

   private _resolveCallback: (resolvedValue?: T) => any = () => {};
   private _rejectCallback: (error: Error) => any = () => {};

   public constructor(asyncFunction: (resolve: (resolvedValue?: T) => any, reject: (error: Error) => any) => any) {
      setTimeout(() => {
         try {
            asyncFunction(this._resolveCallback, this._rejectCallback);
         }
         catch (error) {
            this._rejectCallback(error);
         }
      });
   }

   public then(callback: (resolvedValue?: T) => any) {
      this._resolveCallback = callback;
      return this;
   }

   public catch(callback: (error: Error) => any) {
      this._rejectCallback = callback;
      return this;
   }
}
