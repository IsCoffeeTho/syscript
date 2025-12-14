import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.keyword && (tok.value == "break" || tok.value == "continue"),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.control_flow, tok, {
			word: tok
		});
		retval.complete = true;
		return retval;
	},
};
