import LSP from "./LSP";


export type LspOptions = {
	logFile: string
};

export default function startLSP(opt: LspOptions) {
	const logFile = Bun.file(opt.logFile);
	logFile.write("");
	const logWriter = logFile.writer();

	function loggerAppend(wrapWith: [string, string], ...stuff: any) {
		var time = new Date();

		var timeString = `${time.getFullYear().toString().padStart(4, "0")}-`
		timeString += `${time.getMonth().toString().padStart(2, "0")}-`;
		timeString += `${time.getDate().toString().padStart(2, "0")} `;
		timeString += `${time.getHours().toString().padStart(2, "0")}:`
		timeString += `${time.getMinutes().toString().padStart(2, "0")}:`;
		timeString += `${time.getSeconds().toString().padStart(2, "0")}:`; 
		timeString += `${(time.getMilliseconds()).toString().padStart(4, "0")}`;

		logWriter.write(`[${timeString}] ${wrapWith[0]} ${stuff
			.map((v: any) => {
				if (v == null) return `null`;
				switch (typeof v) {
					case "object":
						return JSON.stringify(v, null, "  ");
				}
				return `${v}`;
			})
			.join(" ")}
			${wrapWith[1]}\n`);
	}

	console.log = (...stuff: any) => {
		loggerAppend(["", ""], ...stuff);
	};
	console.info = console.log;
	console.warn = console.log;
	console.debug = console.log;
	console.error = (...stuff: any) => {
		loggerAppend(["\x1b[31m", "\x1b[0m"], ...stuff);
	};
	const syscriptLSP = new LSP();

	syscriptLSP.register("initialize", (data, res) => {
		console.log("INIT", data);
		
		return res.send({});
	});

	syscriptLSP.begin();
	console.warn("LSP has started");
	process.on("beforeExit", () => {
		console.warn("LSP exiting");
	});
}
