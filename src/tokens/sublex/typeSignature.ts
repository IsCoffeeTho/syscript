import { lexicon, lexiconType, unknownLexicon, type sublexer } from "../lexer";
import type { parseMachine } from "../parseMachine";
import { token, tokenType, unknownToken } from "../tokenize";
import { nextAfterWSC } from "./removers";

type typeLexicon = {
	name: token,
	list?: token
};

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.identifier,
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.type_sig, tok, <typeLexicon>{
			name: tok,
		});
		retToken.complete = true;
		tok = nextAfterWSC(tokenizer);
		if (tok.type == tokenType.grapheme && tok.value == "[]") {
			retToken.children.list = tok;
		} else
			tokenizer.push(tok);
		return retToken;
	},
};
