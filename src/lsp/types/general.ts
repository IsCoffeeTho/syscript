export type ProgressToken = number | string;

export type ProgressParam<T> = {
	token: ProgressToken;
	value: T;
};

export type WorkDoneProgress = {
		workDoneToken?: ProgressToken;
};

export type TraceValue = "off" | "messages" | "verbose";

export type URI = string;
