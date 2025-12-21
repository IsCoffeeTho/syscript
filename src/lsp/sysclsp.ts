import LSP from "./LSP";
import pkg from "../../package.json";
import type Document from "./types/document";
import tokenize, { tokenType } from "../tokens/tokenize";
import compilerError, { errorLevel } from "../errors/compiler";
import { RpcError } from "./RPC";
import graphemizer from "../tokens/grapheme";
import lexer from "../tokens/lexer";

export default function sysclsp() {
	const lsp = LSP({
		name: "sysc-lsp",
		version: pkg.version,
	});
	const logger = lsp.logger;
	
	lsp.onDocChange((req) => {
		
	});

	lsp.onHover(async (req, res) => {
		var filename = req.textDocument.uri;
		var file = await fetch(filename);
		var buf = await file.bytes();
		var tokenizer = tokenize(Buffer.from(buf));
		tokenizer = graphemizer(tokenizer);
		while (tokenizer.hasNext()) {
			var token = tokenizer.next();
			if (token.line - 1 == req.position.line) {
				if ((token.col + token.value.length - 1) >= req.position.character) {
					res.result.contents = {
						kind: "markdown",
						value: `\`${tokenType[token.type]} ${req.position.line}:${req.position.character}\``,
					};
					res.result.range = {
						start: {
							line: token.line - 1,
							character: token.col - 1,
						},
						end: {
							line: token.line - 1,
							character: token.col + token.value.length - 1,
						}
					};
					break;
				}
			} else if (token.line > req.position.line)
				break;
		}
		res.send();
	});

	lsp.begin();
}
