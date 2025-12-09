import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";

export default <sublexer>{
	isStartingToken: (tok: token) => (tok.type == tokenType.symbol && tok.value == "?"),
	// 
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.ternary, tok, {
			condition: <lexicon | undefined>undefined,
			trueBranch: <lexicon | undefined>undefined,
			falseBranch: <lexicon | undefined>undefined
		});
		
		
		
		return retToken;
	},
};
