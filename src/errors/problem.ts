export enum ProblemLevel {
	Error,
	Warn,
	Info,
	Log,
	Debug,
}

export type problemContext = {
	filename?: string;
	line?: number;
	col?: number;
	size?: number;
	level?: ProblemLevel;
	callerfile?: string;
};

export class Problem {
	constructor(
		public readonly description: string,
		public readonly ctx?: problemContext,
	) {
		var originalFunc = Error.prepareStackTrace;

		var callerfile;
		try {
			var err = new Error();
			var currentfile;

			Error.prepareStackTrace = function (err, stack) {
				return stack;
			};
			
			if (!err)
				return;
			if (!err.stack)
				return;

			currentfile = (<NodeJS.CallSite>(<NodeJS.CallSite[]><unknown>err.stack).shift()).getFileName();

			while (err.stack.length) {
				callerfile = (<NodeJS.CallSite>(<NodeJS.CallSite[]><unknown>err.stack).shift()).getFileName();

				if (currentfile !== callerfile) break;
			}
		} catch (e) {}

		Error.prepareStackTrace = originalFunc;

		if (!this.ctx)
			this.ctx = {};
		this.ctx.callerfile = callerfile ?? "";
	}
}

Problem.prototype.toString = function () {
	var problemString = "";

	if (this.ctx) {
		if (this.ctx.level != undefined) {
			problemString += `[${ProblemLevel[this.ctx.level]}] `;
		}

		if (this.ctx.filename) {
			problemString += `${this.ctx.filename}`;
			if (this.ctx.line) {
				problemString += `:${this.ctx.line}`;
				if (this.ctx.col) {
					problemString += `:${this.ctx.col}`;
				}
			}
			problemString += ": ";
		}
	}
	problemString += this.description;
	// if (this.ctx?.callerfile)
	// 	problemString += ` <${this.ctx?.callerfile}>`;

	return problemString;
};
