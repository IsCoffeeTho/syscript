import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";

export default <sublexer>{
	isStartingToken: (tok: token) => {
		if (!tok) return false;
		var startOfFile = tok.line == 1 && tok.col == 1;
		return startOfFile && tok.type == tokenType.grapheme && tok.value == "#!";
	},
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.shebang, startingToken);

		while (tokenizer.hasNext()) {
			var tok = tokenizer.next();
			retToken.children.push(tok);
			if (tok.type == tokenType.newline) break;
		}

		retToken.complete = true;
		return retToken;
	},
};
