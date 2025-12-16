import parseArguments from "./cli/arguments";
import pkg from "../package.json";
import compilerError, { errorLevel } from "./errors/compiler.ts";
import tokenize, { token } from "./tokens/tokenize.ts";
import lexer from "./tokens/lexer.ts";
import graphemizer from "./tokens/grapheme.ts";
import startLSP, { type LspOptions } from "./lsp/startlsp.ts";
import type { CompilerOptions } from "./compiler/compiler.ts";
import compiler from "./compiler/compiler.ts";

var lspMode = false;

var compilerOptions: CompilerOptions = {
	debugError: false,
	inputFiles: <string[]>[],
	outputFile: "a.out",
};

var lspOptions: LspOptions = {
	logFile: `${process.env["HOME"]}/.var/sysc-lsp.log`
};

parseArguments(
	"sysc",
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
			description: "Runs the LSP for in editor errors and assistance.",
			trigger() {
				lspMode = true;
			},
		},
		{
			parameter: "log-file",
			description: "(requires: --lsp) sets the log file of the lsp.",
			args: ["file"],
			trigger(file: string) {
				lspOptions.logFile = file;
			},
		},
		{
			parameter: "output",
			flag: "o",
			description: "Set where the compiled output should be saved.",
			args: ["file"],
			trigger(file: string) {
				compilerOptions.outputFile = file;
			},
		},
		{
			parameter: "debug-compilation",
			description: "Provide error information about the compiling process.",
			trigger() {
				compilerOptions.debugError = true;
			},
		},
	],
	arg => {
		compilerOptions.inputFiles.push(arg);
	},
);

if (lspMode) {
	startLSP(lspOptions);
} else {
	compiler(compilerOptions);
}
