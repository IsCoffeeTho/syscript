import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import logicalOperator from "../operators/logical";
import { nextAfterWSC } from "../removers";
import singletonValue from "./singletonValue";

export default <sublexer>{
	isStartingToken: (tok: token) => (tok.type == tokenType.identifier),
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.value, startingToken, [
			singletonValue.lexer(startingToken, tokenizer)
		]);
		
		
		
		var tok = nextAfterWSC(tokenizer);
		if (!logicalOperator.isStartingToken(tok)) {
			tokenizer.push(tok);
		}
		tok = nextAfterWSC(tokenizer);
		

		return retToken;
	},
};
