export default function logger(file: string) {
	const logFile = Bun.file(file);
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
}