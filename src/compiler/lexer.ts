import { tokenType, type token } from "./tokenize";
import type { parseMachine } from "./parseMachine";

export type lexicon = {
	type: string;
	children: (token | lexicon)[];
};

export type sublexer = {
	name: string;
	isStartingToken: (tok: token) => boolean;
	lexer: (startToken: token, tokenizer: parseMachine<token>) => lexicon;
};

import functions from "./sublex/functions";
import structs from "./sublex/structs";
import classes from "./sublex/classes";
import shebang from "./sublex/shebang";
import comments from "./sublex/comments/comments";
import whitespaces from "./sublex/whitespaces";
import compilerError from "../errors/compilerError";

const documentLevelLexicons = [
	functions,
	structs,
	classes,
	comments,
	shebang,
];

export default function lexer(filename: string, tokenizer: parseMachine<token>): (lexicon|token)[] {
	var doc: (lexicon | token)[] = [];
	
	while (tokenizer.hasNext()) {
		var tok = tokenizer.next();
		var parsed = false;
		if (tok.type == tokenType.whitespace || tok.type == tokenType.newline)
			continue;
		for (var lexicon of documentLevelLexicons) {
			var lexStarted = lexicon.isStartingToken(tok);
			if (!lexStarted)
				continue;
			parsed = true;
			doc.push(<any>lexicon.lexer(tok, tokenizer));
			break;
		}
		if (!parsed)
			doc.push(tok);
	}
	
	return doc;
}
