import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import operator from "../operators/operator";
import { nextAfterWSC } from "../removers";
import singletonValue from "./singletonValue";

export default <sublexer>{
	isStartingToken: (tok: token) => singletonValue.isStartingToken(tok),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.value, tok, [
			singletonValue.lexer(tok, tokenizer)
		]);
		
		tok = nextAfterWSC(tokenizer);
		while (operator.isStartingToken(tok)) {
			retval.children.push(operator.lexer(tok, tokenizer));
			tok = nextAfterWSC(tokenizer);
			if (!singletonValue.isStartingToken(tok)) return retval;
			retval.children.push(singletonValue.lexer(tok, tokenizer));
			tok = nextAfterWSC(tokenizer);
		}
		if (tok.type != tokenType.symbol || tok.value != "?") {
			tokenizer.push(tok);
			retval.complete = true;
			return retval;
		}
		// ternary
	},
};
