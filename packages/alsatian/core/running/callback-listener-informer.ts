import {CallbackFunction} from "../events/generic-callback";

export class ListenerInformer {
	public async informListeners<B, T extends CallbackFunction<B>>(callbackFunctions: Array<T>, parameter: B) {
		for (const callbackFunction of callbackFunctions) {
			await callbackFunction(parameter);
		}
	}
}
