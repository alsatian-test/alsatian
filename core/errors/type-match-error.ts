import { MatchError } from "./match-error";

export class TypeMatchError extends MatchError {
   public constructor(message: any) {
      super(message);
   }
}
