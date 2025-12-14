import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.keyword && (tok.value == "true" || tok.value == "false"),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.boolean_literal, tok, {
			literal: tok,
		});
		retval.complete = true;
		return retval;
	},
};
