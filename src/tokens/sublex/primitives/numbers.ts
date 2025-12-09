import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType, unknownToken } from "../../tokenize";
import comments from "../comments/comments";
import { nextAfterWS } from "../removers";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.numeric,
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.integer_literal, startingToken, [startingToken]);
		retToken.complete = true;
		
		var tok = tokenizer.next();
		if (tok.type == tokenType.symbol && tok.value == ".") {
			retToken.complete = false;
			
			retToken.type = lexiconType.float_literal;
			retToken.children.push(tok);
			tok = tokenizer.next();
			if (tok.type != tokenType.numeric) return retToken;
			retToken.children.push(tok);
			
			retToken.complete = true;
		} else if (tok.type == tokenType.identifier && (tok.value.startsWith("x") || tok.value.startsWith("b"))) {
			retToken.children.push(tok);
		} else {
			tokenizer.push(tok);
		}

		return retToken;
	},
};
