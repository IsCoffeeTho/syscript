import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType, unknownToken } from "../../tokenize";
import comments from "../comments/comments";
import { nextAfterWS } from "../removers";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.grapheme && (tok.value == "+=" || tok.value == "-=" || tok.value == "/=" || tok.value == "*="),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.comparative_operator, tok, {
			operator: tok,
		});
		retToken.complete = true;
		return retToken;
	},
};
