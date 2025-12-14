import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.symbol && tok.value == "'",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.character_literal, tok, {
			start: tok,
			tokens: <token[]>[],
			end: <token | undefined>undefined,
		});

		var escape = false;
		while (tokenizer.hasNext()) {
			tok = tokenizer.next();
			if (!escape && tok.type == tokenType.symbol && tok.value == retval.children.start.value) {
				retval.children.end = tok;
				retval.complete = true;
				return retval;
			}
			escape = (tok.type == tokenType.symbol && tok.value == "\\");
			retval.children.tokens.push(tok);
		}

		return retval;
	},
};
