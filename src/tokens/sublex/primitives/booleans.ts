import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType, unknownToken } from "../../tokenize";
import comments from "../comments/comments";
import { nextAfterWS } from "../removers";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.keyword && (tok.value == "true" || tok.value == "false"),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.boolean_literal, tok, {
			literal: tok,
		});

		retToken.complete = true;
		return retToken;
	},
};
