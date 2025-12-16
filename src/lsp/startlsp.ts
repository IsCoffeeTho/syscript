import logger from "./logger";
import LSP from "./LSP";

export type LspOptions = {
	logFile: string
};

export default function startLSP(opt: LspOptions) {
	logger(opt.logFile);
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
