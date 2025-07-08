import parseArguments from "./cli/arguments"
import pkg from "../package.json"
import compilerError from "./errors/compilerError";
import tokenize, { tokenPrimatives } from "./compiler/tokenizer";

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
		for (var file of inputFiles) {
			Bun.file(file).bytes().then((buf) => {
				var tokenTypes = Object.keys(tokenPrimatives);
				var tokenTypeMap: string[] = [];
				for (var tokenType of tokenTypes) {
					tokenTypeMap[tokenPrimatives[tokenType]] = tokenType;
				}
				var tokenizer = tokenize(buf);
				while(tokenizer.hasNext()) {
					var token = tokenizer.next()
					console.log(tokenTypeMap[token.type], token);
				}
				var token = tokenizer.next()
				console.log(tokenTypeMap[token.type], token);
			});
		}
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
