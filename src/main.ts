import parseArguments from "./cli/arguments"
import pkg from "../package.json"
import compilerError from "./errors/compilerError";
import tokenize from "./compiler/tokenize.ts";
import lexer from "./compiler/lexer.ts";

var inputFiles: string[] = [];
var outputFile: string = "a.out";

var debugError: boolean = false;

parseArguments(pkg.name, [
	{
		parameter: "version",
		flag: 'v',
		description: "Prints version information about the compiler.",
		trigger() {
			console.log(`${pkg.name} v${pkg.version}`);
			process.exit(0);
		}
	},
	{
		parameter: "output",
		flag: 'o',
		description: "Set where the compiled output should be saved.",
		trigger(file: string) {
			outputFile = file;
		}
	},
	{
		parameter: "debug",
		flag: 'd',
		description: "Prints out any errors that occur due to a fail in the syscript compiler.",
		trigger() {
			debugError = true;
		}
	}
], (arg) => {
	inputFiles.push(arg);
});

try {
	if (!inputFiles.length) {
		throw new compilerError("noinputfiles", { message: "Missing input files" });
	}

	(async () => {
		var waitFor = [];
		for (var file of inputFiles) {
			waitFor.push((async () => {
				console.log(file);
				var buf = await Bun.file(file).bytes();
				var tokenizer = tokenize(Buffer.from(buf));
				var doc = lexer(file, tokenizer);
				console.log(doc);
			})());
		}
		await Promise.allSettled(waitFor);
	})();

} catch (err) {
	if (err instanceof compilerError)
		process.stderr.write(err.toString());
	else {
		process.stderr.write("There was an unexpected error.\n");
		(!debugError) ? process.stderr.write("Add --debug or -d to see the error\n") : console.error(err);
	}
	process.stderr.write("compilation terminated.\n");
	process.exit(1);
}
