import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";


export default <sublexer> {
	name: "comment_single",
	isStartingToken: (tok: token) => (tok.type == tokenType.grapheme && tok.value == "//"),
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.single_comment, startingToken, [
			startingToken
		]);

		while (tokenizer.hasNext()) {
			var tok = tokenizer.next();
			retToken.children.push(tok);
			if (tok.type == tokenType.newline)
				break;
		}
		
		retToken.complete = true;
		return retToken;
	}
};