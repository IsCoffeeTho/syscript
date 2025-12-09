import { lexicon, lexiconType, unknownLexicon, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType, unknownToken } from "../../tokenize";
import { nextAfterWS } from "../removers";
import booleans from "./booleans";
import chars from "./chars";
import numbers from "./numbers";
import strings from "./strings";

export default <sublexer>{
	isStartingToken: (tok: token) => {
		if (chars.isStartingToken(tok)) return true;
		if (strings.isStartingToken(tok)) return true;
		if (booleans.isStartingToken(tok)) return true;
		if (numbers.isStartingToken(tok)) return true;
		return false;
	},
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.primitive, startingToken, {
			component: unknownLexicon
		});
	
		if (numbers.isStartingToken(startingToken)) retToken.children.component = numbers.lexer(startingToken, tokenizer);
		else if (chars.isStartingToken(startingToken)) retToken.children.component = chars.lexer(startingToken, tokenizer);
		else if (booleans.isStartingToken(startingToken)) retToken.children.component = booleans.lexer(startingToken, tokenizer);
		else if (strings.isStartingToken(startingToken)) retToken.children.component = strings.lexer(startingToken, tokenizer);
		
		retToken.complete = true;
		return retToken;
	},
};
