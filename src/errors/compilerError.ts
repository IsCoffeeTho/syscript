export type compilerErrorOptions = {
	message: string,	
};

export default class compilerError {
	readonly id: string;
	readonly message : string;
	constructor(id: string, options: compilerErrorOptions) {
		this.id = id;
		this.message = options.message;
	}
}

compilerError.prototype.toString = function() {
	return `Compiler Error: ${this.id}: ${this.message}\n`;
}