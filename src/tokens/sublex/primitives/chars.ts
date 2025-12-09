import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType, unknownToken } from "../../tokenize";
import comments from "../comments/comments";
import { nextAfterWS } from "../removers";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.symbol && tok.value == "'",
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.character_literal, startingToken, {
			start: startingToken,
			tokens: <token[]>[],
			end: <token | undefined>undefined,
		});

		while (tokenizer.hasNext()) {
			var tok = nextAfterWS(tokenizer);
			if (tok.type == tokenType.symbol && tok.value == startingToken.value) {
				retToken.children.end = tok;
				retToken.complete;
				return retToken;
			} else {
				retToken.children.tokens.push(tok);
			}
		}

		return retToken;
	},
};
