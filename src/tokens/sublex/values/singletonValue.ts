import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import primitive from "../primitives/primitive";
import { nextAfterWSC } from "../removers";
import parenthEnclosed from "./parenthEnclosed";
import reference from "./reference";

let isStartingToken = (tok: token) => {
	if (parenthEnclosed.isStartingToken(tok)) return true;
	if (primitive.isStartingToken(tok)) return true;
	if (reference.isStartingToken(tok)) return true;
	return false;
};

export default <sublexer>{
	isStartingToken,
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.singleton_value, startingToken, {
			component: <lexicon | undefined>undefined,
		});
		retToken.complete = true;

		if (parenthEnclosed.isStartingToken(startingToken)) retToken.children.component = parenthEnclosed.lexer(startingToken, tokenizer);
		else if (primitive.isStartingToken(startingToken)) retToken.children.component = primitive.lexer(startingToken, tokenizer);
		else if (reference.isStartingToken(startingToken)) retToken.children.component = reference.lexer(startingToken, tokenizer);
		else retToken.complete = false;
		return retToken;
	},
};
