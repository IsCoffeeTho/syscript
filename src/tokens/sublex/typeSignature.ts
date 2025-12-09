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
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.type_sig, startingToken, <typeLexicon>{
			name: startingToken,
		});
		retToken.complete = true;
		var tok = nextAfterWSC(tokenizer);
		if (tok.type == tokenType.grapheme && tok.value == "[]") {
			retToken.children.list = tok;
		} else
			tokenizer.push(tok);
		return retToken;
	},
};
