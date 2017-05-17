import { ContentsMatchError, EmptyMatchError } from "../errors";
import { ContainerMatcher } from "./container-matcher";

export class ArrayMatcher<T> extends ContainerMatcher<Array<T>, T> { }
