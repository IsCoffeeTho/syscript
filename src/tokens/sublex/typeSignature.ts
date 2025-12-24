import { lexicon, lexiconType, type sublexer } from "../lexer";
import type { parseMachine } from "../parseMachine";
import { token, tokenType } from "../tokenize";
import { nextAfterWSC } from "./removers";

type typeLexicon = {
	name: token,
	list?: token
};

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.identifier,
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.type_sig, tok, <typeLexicon>{
			name: tok,
		});
		retval.complete = true;
		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (tok.type == tokenType.grapheme && tok.value == "[]") {
			retval.children.list = tok;
		} else
			tokenizer.push(tok);
		return retval;
	},
};
