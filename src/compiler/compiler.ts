import compilerError, { errorLevel } from "../errors/compiler";
import graphemizer from "../tokens/grapheme";
import lexer from "../tokens/lexer";
import tokenize from "../tokens/tokenize";

export type CompilerOptions = {
	debugError: boolean,
	inputFiles: string[],
	outputFile: string,
};

export default async function compiler(opt: CompilerOptions) {
	try {
		if (!opt.inputFiles.length) {
			throw new compilerError({
				message: `Missing input files.`,
				level: errorLevel.error
			});
		}

		var waitFor = [];
		for (var filename of opt.inputFiles)
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
			!opt.debugError ? console.error("Add --debug-compilation to see the error") : console.error(err);
		}
		process.stderr.write("compilation terminated.\n");
		process.exit(1);
	}
}