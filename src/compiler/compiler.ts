import { Problem, ProblemLevel } from "../errors/problem";
import graphemizer from "../tokens/grapheme";
import lexer, { lexicon } from "../tokens/lexer";
import tokenize, { token } from "../tokens/tokenize";
import locale from "../locale.json";
import { aggregateProblems } from "../semantic/AggregateProblems";
import { markOrphans } from "../semantic/markOrphans";
import { semanticAnalysis } from "../semantic/analyze";

export type CompilerOptions = {
	debugError: boolean;
	inputFiles: string[];
	outputFile: string;
};

export default async function compiler(opt: CompilerOptions) {
	try {
		if (!opt.inputFiles.length) {
			throw new Problem(`Missing input files.`, {
				level: ProblemLevel.Error,
			});
		}

		var waitFor = [];
		for (var filename of opt.inputFiles)
			waitFor.push(
				(async () => {
					var file = Bun.file(filename);
					if (!(await file.exists()))
						throw new Problem(locale.missing_input_files, {
							filename,
							level: ProblemLevel.Error,
						});
					var buf = await file.bytes();
					var tokenizer = tokenize(Buffer.from(buf), filename);
					tokenizer = graphemizer(tokenizer);
					var doc = lexer(tokenizer);
					var ast: (lexicon | token)[] = [];
					while (doc.hasNext()) {
						ast.push(doc.next());
					}
					var semantic = semanticAnalysis(ast, filename);
					semantic.problemsList.forEach(v => {
						console.log(`${v}`);
					});
					if (semantic.problemsList.length > 0) process.exit(1);
				})(),
			);
		await Promise.all(waitFor);
	} catch (err) {
		if (err instanceof Problem) {
			console.log(err.toString());
		} else {
			console.error(locale.uncaught_error);
			!opt.debugError ? console.error(locale.debug_comp_flag_tutorial) : console.error(err);
		}
		process.stderr.write(`${locale.compilation_terminated}\n`);
		process.exit(1);
	}
}
