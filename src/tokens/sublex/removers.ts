import type { lexicon } from "../lexer";
import type { parseMachine } from "../parseMachine";
import { tokenType, type token } from "../tokenize";
import comments from "./comments/comments";

// remove whitespaces (including newline)
export function nextAfterWS(tokenizer: parseMachine<token>): token {
	while (tokenizer.hasNext()) {
		var tok = tokenizer.next();
		if (tok.type != tokenType.whitespace && tok.type != tokenType.newline) return tok;
	}
	return tokenizer.next();
	
}

// remove whitespaces (except for newline)
export function nextAfterWSL(tokenizer: parseMachine<token>): token {
	while (tokenizer.hasNext()) {
		var tok = tokenizer.next();
		if (tok.type != tokenType.whitespace)
			return tok;
	}
	return tokenizer.next();
}

// remove whitespaces and comments
export function nextAfterWSC(tokenizer: parseMachine<token>): token {
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
