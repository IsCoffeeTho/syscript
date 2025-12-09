import { lexicon, lexiconType, unknownLexicon, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import tokenize, { type token, tokenType, unknownToken } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import value from "./value";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.symbol && tok.value == "(",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.parenthesis_enclosed, tok, {
			start: tok,
			value: unknownLexicon,
			end: unknownToken,
		});
		
		tok = nextAfterWSC(tokenizer);
		if (!value.isStartingToken(tok)) return retToken;
		retToken.children.value = value.lexer(tok, tokenizer);
		tok = nextAfterWSC(tokenizer);
		if (tok.type != tokenType.symbol && tok.value != ")") return retToken;
		retToken.children.end = tok;
		
		retToken.complete = true;
		return retToken;
	},
};
