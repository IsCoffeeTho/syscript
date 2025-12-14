import parseArguments from "./cli/arguments";
import pkg from "../package.json";
import compilerError, { errorLevel } from "./errors/compiler.ts";
import tokenize, { token } from "./tokens/tokenize.ts";
import lexer from "./tokens/lexer.ts";
import graphemizer from "./tokens/grapheme.ts";
import keywordizer from "./tokens/keywords.ts";
import sysLSP from "./lsp/lsp.ts";

var inputFiles: string[] = [];
var outputFile = "a.out";
var lspConfig = `${process.env["HOME"]}/.config/syscript/lsp.config`

var debugError = false;
var startLSP = false;

parseArguments(
	pkg.name,
	[
		{
			parameter: "version",
			flag: "v",
			description: "Prints version information about the compiler.",
			trigger() {
				console.log(`${pkg.name} v${pkg.version}`);
				process.exit(0);
			},
		},
		{
			parameter: "lsp",
			description: "Runs the LSP for in editor errors and assistance",
			trigger() {
				startLSP = true;
			}
		},
		{
			parameter: "lsp-config",
			description: "Runs the LSP for in editor errors and assistance",
			trigger(file: string) {
				lspConfig = file;
			}
		},
		{
			parameter: "output",
			flag: "o",
			description: "Set where the compiled output should be saved.",
			trigger(file: string) {
				outputFile = file;
			},
		},
		{
			parameter: "debug-compilation",
			description: "",
			trigger() {
				debugError = true;
			},
		},
	],
	arg => {
		inputFiles.push(arg);
	},
);

if (startLSP) {
	const lsp = new sysLSP(lspConfig);
} else {
	try {
		if (!inputFiles.length) {
			throw new compilerError({
				message: `Missing input files.`,
				level: errorLevel.error
			});
		}

		var waitFor = [];
		for (var filename of inputFiles)
			waitFor.push(
				(async () => {
					console.log(filename);
					var file = Bun.file(filename);
					if (!(await file.exists()))
						throw new compilerError({
							message: `Cannot read "${filename}", file does not exist.`,
							level: errorLevel.error
						});
					var buf = await file.bytes();
					var tokenizer = tokenize(Buffer.from(buf));
					tokenizer = keywordizer(tokenizer);
					tokenizer = graphemizer(tokenizer);
					var doc = lexer(tokenizer);
					while (doc.hasNext()) {
						console.log(`${doc.next()}`);
					}
				})(),
			);
		await Promise.all(waitFor);
	} catch (err) {
		if (err instanceof compilerError) {
			console.log(err.toString());
		}
		else {
			console.error("There was an unexpected error.");
			!debugError ? console.error("Add --debug-compilation to see the error") : console.error(err);
		}
		process.stderr.write("compilation terminated.\n");
		process.exit(1);
	}
}