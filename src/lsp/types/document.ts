import graphemize from "../../tokens/grapheme";
import type { lexicon } from "../../tokens/lexer";
import lexer from "../../tokens/lexer";
import tokenize, { type token } from "../../tokens/tokenize";
import type { Range } from "./general";

export type DocumentUri = string;

export type ContentChange = {
	range: Range;
	text: string;
};

export default class Document {
	lines: string[] = [];
	parseTimer?: Timer;
	updated: boolean = false;

	ast: (lexicon<any> | token)[] = [];

	constructor(
		public lsp: any,
		public uri: DocumentUri,
	) {}

	async forceSync() {
		var response = await fetch(this.uri);
		if (!response.ok)
			throw new Error("File not found");
		this.lines = (await response.text()).split("\n");
		this.updateParseTimer();
	}

	async parse() {
		this.parseTimer = undefined;
		this.ast = [];
		var buf = Buffer.from(this.lines.join("\n"));
		var tokenizer = tokenize(buf);
		var graphemizer = graphemize(tokenizer);
		var lexical = lexer(graphemizer);
		while (lexical.hasNext()) {
			var lex = lexical.next();
			this.ast.push(lex);
		}
		this.updated = true;
	}

	updateParseTimer() {
		this.updated = false;
		if (this.parseTimer) clearTimeout(this.parseTimer);
		this.parseTimer = setTimeout(() => {
			this.parse();
		}, 500);
	}

	makeEdit(changes: ContentChange[]) {
		for (var change of changes) {
			var startingLine = change.range.start.line;
			var endLine = change.range.end.line;
			var pulledLines = this.lines.slice(startingLine, endLine + 1);

			var startBuffer = <string>pulledLines.at(0);
			startBuffer = startBuffer.slice(0, change.range.start.character);

			var endBuffer = <string>pulledLines.at(-1);
			endBuffer = endBuffer.slice(change.range.end.character);

			var replacement = `${startBuffer}${change.text}${endBuffer}`;
			this.lines = [
				// prior, edit, post
				...this.lines.slice(0, startingLine),
				...replacement.split("\n"),
				...this.lines.slice(endLine + 1),
			];
		}
		this.updateParseTimer();
	}
}
