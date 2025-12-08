import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.symbol && tok.value == "{",
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.code_block, startingToken);
		retToken.complete = true;
		return retToken;
	},
};
