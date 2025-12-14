import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import accessor from "./accessor";
import funcCall from "./funcCall";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.symbol && tok.value == ".",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.subreference, tok, <(lexicon | token)[]>[]);

		tok = nextAfterWSC(tokenizer);

		if (tok.type != tokenType.identifier) return retval;
		retval.children.push(tok);

		tok = nextAfterWSC(tokenizer);

		if (accessor.isStartingToken(tok)) {
			retval.children.push(accessor.lexer(tok, tokenizer));
			tok = nextAfterWSC(tokenizer);
		}
		
		if (funcCall.isStartingToken(tok)) {
			retval.children.push(funcCall.lexer(tok, tokenizer));
			tok = nextAfterWSC(tokenizer);
		}

		tokenizer.push(tok);

		retval.complete = true;
		return retval;
	},
};
