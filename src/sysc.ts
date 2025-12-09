import parseArguments from "./cli/arguments";
import pkg from "../package.json";
import compilerError, { errorLevel } from "./errors/compiler.ts";
import tokenize, { token } from "./tokens/tokenize.ts";
import lexer from "./tokens/lexer.ts";
import graphemizer from "./tokens/grapheme.ts";

var inputFiles: string[] = [];
var outputFile: string = "a.out";

var debugError: boolean = false;

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
				tokenizer = graphemizer(tokenizer);
				var doc = lexer(filename, tokenizer);
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
