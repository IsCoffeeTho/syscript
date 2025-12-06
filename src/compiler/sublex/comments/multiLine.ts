import type { lexicon, sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";


export default <sublexer> {
	name: "comment_multi",
	isStartingToken: (tok: token) => (tok.type == tokenType.grapheme && tok.value == "/*"),
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken : lexicon = {
			type: "comment_multi",
			children: [startingToken]
		};
		while (tokenizer.hasNext()) {
			var tok = tokenizer.next();
			retToken.children.push(tok);
			if (tok.type == tokenType.grapheme && tok.value == "*/")
				break;
		}
		return retToken;
	}
};