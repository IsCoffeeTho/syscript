import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import value from "../values/value";

export default <sublexer>{
	isStartingToken: (tok: token) => (tok.type == tokenType.identifier && tok.value == "return"),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.if_statement, tok, {
			start: tok,
			value: <lexicon | undefined>undefined
		});
		
		tok = nextAfterWSC(tokenizer);
		if (!value.isStartingToken(tok))
			return retval;
		retval.children.value = value.lexer(tok, tokenizer);
		
		retval.complete = true;
		return retval;
	},
};
