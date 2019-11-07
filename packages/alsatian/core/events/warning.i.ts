export interface IWarningEvent {
	warning: string;
}

export type IOnWarningCBFunction = (
	warning: IWarningEvent
) => void;
