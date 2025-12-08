import { lexicon, lexiconType, type sublexer } from "../lexer";
import type { parseMachine } from "../parseMachine";
import { tokenType, type token } from "../tokenize";
import { wsc } from "./removers";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.identifier,
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.type_sig, startingToken, {
			
		});
		
		retToken.complete = true;
		return retToken;
	},
};
