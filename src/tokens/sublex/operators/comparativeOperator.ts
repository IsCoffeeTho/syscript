import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";

export default <sublexer>{
	isStartingToken: (tok: token) =>
		tok &&
		((tok.type == tokenType.symbol && (tok.value == "<" || tok.value == ">")) ||
			(tok.type == tokenType.grapheme && (tok.value == "==" || tok.value == "!=" || tok.value == ">=" || tok.value == "<="))),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.comparative_operator, tok, {
			operator: tok,
		});
		retval.complete = true;
		return retval;
	},
};
