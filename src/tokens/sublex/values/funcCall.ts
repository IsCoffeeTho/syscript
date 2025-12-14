import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import value from "./value";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.symbol && tok.value == "(",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.call, tok, {
			start: tok,
			values: <lexicon[]>[],
			end: <token | undefined>undefined,
		});
		
		tok = nextAfterWSC(tokenizer);
		while (value.isStartingToken(tok)) {
			retval.children.values.push(value.lexer(tok, tokenizer));
			tok = nextAfterWSC(tokenizer);
			if (tok.type != tokenType.symbol || tok.value != ",") break;
			tok = nextAfterWSC(tokenizer);
		}
		retval.complete = (tok.type == tokenType.symbol && tok.value == ")")
		if (retval.complete)
			retval.children.end = tok;
		return retval;
	},
};
