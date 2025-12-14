import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.grapheme && ( tok.value == "||" || tok.value == "&&"),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.logic_operator, tok, {
			operator: tok
		});
		retval.complete = true;
		return retval;
	},
};
