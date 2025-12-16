import logger from "./logger";
import LSP from "./LSP";

export type LspOptions = {
	logFile: string
};

export default function startLSP(opt: LspOptions) {
	logger(opt.logFile);
	const syscriptLSP = new LSP();
	
	syscriptLSP.register("error", (data, res) => {
		console.error(data);
	});
	
	syscriptLSP.register("initialized", (data, res) => {
		syscriptLSP.send({
			method: "window/showMessage",
			params: {
				type: 3,
				message: "Ready!"
			}
		});
		res.send({});
	});

	syscriptLSP.register("initialize", (data, res) => {
		res.send({
			capabilities: {
				textDocumentSync: {
					openClose: true,
					change: true
				}
			},
			serverInfo: {
				name: "sysc-lsp",
				version: `0.0.1`
			}
		});
	});

	syscriptLSP.begin();
	console.warn("LSP has started");
	process.on("beforeExit", () => {
		console.warn("LSP exiting");
	});
}
