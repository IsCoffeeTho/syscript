import type { lexicon } from "../lexer";
import type { parseMachine } from "../parseMachine";
import { tokenType, type token } from "../tokenize";
import comments from "./comments/comments";

export function ws(tokenizer: parseMachine<token>) {
	var retval: (lexicon | token)[] = [];
	while (tokenizer.hasNext()) {
		var tok = tokenizer.peek();
		if (tok.type != tokenType.whitespace && tok.type != tokenType.newline) return retval;
		tokenizer.next();
	}
}

export function wsl(tokenizer: parseMachine<token>) {
	var retval: (lexicon | token)[] = [];
	while (tokenizer.hasNext()) {
		var tok = tokenizer.peek();
		if (tok.type != tokenType.whitespace) return retval;
		retval.push(tok);
		tokenizer.next();
	}
	return retval;
}

// remove whitespaces and comments
export function wsc(tokenizer: parseMachine<token>): token {
	while (tokenizer.hasNext()) {
		var tok = tokenizer.next();
		if (tok.type == tokenType.whitespace)
			continue;
		if (comments.isStartingToken(tok)) {
			comments.lexer(tok, tokenizer);
			continue;
		}
		return tok;
	}
	return tokenizer.next();
}
