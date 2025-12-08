import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import type { token } from "../../tokenize";
import multiLine from "./multiLine";
import singleLine from "./singleLine";

export default <sublexer>{
	isStartingToken: (tok: token) => singleLine.isStartingToken(tok) || multiLine.isStartingToken(tok),
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.comment, startingToken);

		if (startingToken.value == "//") retToken = new lexicon(lexiconType.comment, singleLine.lexer(startingToken, tokenizer));
		else if (startingToken.value == "/*") retToken = new lexicon(lexiconType.comment, multiLine.lexer(startingToken, tokenizer));

		retToken.complete = true;
		return retToken;
	},
};
