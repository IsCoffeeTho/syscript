import type { lexicon, sublexer } from "../lexer";
import type { parseMachine } from "../parseMachine";
import { tokenType, type token } from "../tokenize";

export default <sublexer>{
	name: "shebang",
	isStartingToken: (tok: token) => {
		var startOfFile = (tok.line == 1 && tok.col == 1);
		return (startOfFile && tok.type == tokenType.grapheme && tok.value == "#!")
	},
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken : lexicon = {
			type: "shebang",
			children: [startingToken]
		};
		
		while (tokenizer.hasNext()) {
			var tok = tokenizer.next();
			retToken.children.push(tok);
			if (tok.type == tokenType.newline)
				break;
		}
		return retToken;
	}
};