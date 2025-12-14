import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import value from "./value";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.symbol && tok.value == "[",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.accessor, tok, {
			value: <lexicon | undefined>undefined,
		});

		tok = nextAfterWSC(tokenizer);
		if (!value.isStartingToken(tok)) return retval;
		retval.children.value = value.lexer(tok, tokenizer);

		tok = nextAfterWSC(tokenizer);
		if (tok.type != tokenType.symbol || tok.value != "]") return retval;

		retval.complete = true;
		return retval;
	},
};
