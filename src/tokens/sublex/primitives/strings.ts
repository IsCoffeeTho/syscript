import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType, unknownToken } from "../../tokenize";
import comments from "../comments/comments";
import { nextAfterWS } from "../removers";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.symbol && ( tok.value == '"' || tok.value == '`'),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.string_literal, tok, {
			start: tok,
			tokens: <(token)[]>[],
			end: <token | undefined>undefined,
		});
		
		while (tokenizer.hasNext()) {
			tok = nextAfterWS(tokenizer);
			if (tok.type == tokenType.symbol && tok.value == tok.value) {
				retToken.children.end = tok;
				retToken.complete
				return retToken;
			} else {
				retToken.children.tokens.push(tok);
			}
		}
		
		return retToken;
	},
};
