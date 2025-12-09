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
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.primitive, tok, {
			component: unknownLexicon
		});
	
		if (numbers.isStartingToken(tok)) retToken.children.component = numbers.lexer(tok, tokenizer);
		else if (chars.isStartingToken(tok)) retToken.children.component = chars.lexer(tok, tokenizer);
		else if (booleans.isStartingToken(tok)) retToken.children.component = booleans.lexer(tok, tokenizer);
		else if (strings.isStartingToken(tok)) retToken.children.component = strings.lexer(tok, tokenizer);
		
		retToken.complete = true;
		return retToken;
	},
};
