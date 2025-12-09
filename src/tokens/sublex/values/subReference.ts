import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import logicalOperator from "../operators/logicalOperator";
import { nextAfterWSC } from "../removers";
import singletonValue from "./singletonValue";

export default <sublexer>{
	isStartingToken: (tok: token) => (tok.type == tokenType.symbol && tok.value == "."),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.value, tok, [
			tok
		]);
		
		tok = nextAfterWSC(tokenizer);
		if (!logicalOperator.isStartingToken(tok)) {
			tokenizer.push(tok);
		}
		tok = nextAfterWSC(tokenizer);
		

		return retToken;
	},
};
