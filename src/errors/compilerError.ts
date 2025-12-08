export enum errorLevel {
	debug,
	info,
	warn,
	error
}

export type compilerErrorOptions = {
	message: string;
	level?: errorLevel;
};

export default class compilerError {
	readonly message: string;
	readonly level: errorLevel;
	constructor(options: compilerErrorOptions) {
		this.message = options.message;
		this.level = options.level ?? errorLevel.debug;
	}
}

compilerError.prototype.toString = function () {
	return `Error: ${this.message}\n`;
};
