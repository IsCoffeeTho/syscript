import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import logicalOperator from "../operators/logicalOperator";
import operator from "../operators/operator";
import primitive from "../primitives/primitive";
import { nextAfterWSC } from "../removers";
import parenthEnclosed from "./parenthEnclosed";
import singletonValue from "./singletonValue";



export default <sublexer>{
	isStartingToken: (tok: token) => singletonValue.isStartingToken(tok),
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.value, startingToken, [
			singletonValue.lexer(startingToken, tokenizer)
		]);
		
		var tok = nextAfterWSC(tokenizer);
		if (!operator.isStartingToken(tok)) {
			tokenizer.push(tok);
			retToken.complete = true;
			return retToken;
		}
		retToken.children.push(operator.lexer(tok, tokenizer));
		tok = nextAfterWSC(tokenizer);
		if (!singletonValue.isStartingToken(tok)) return retToken;
		retToken.children.push(singletonValue.lexer(tok, tokenizer));
		
		retToken.complete = true;
		return retToken;
	},
};
