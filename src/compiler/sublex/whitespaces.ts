import type { lexicon, sublexer } from "../lexer";
import type { parseMachine } from "../parseMachine";
import { tokenType, type token } from "../tokenize";

export default <sublexer>{
	name: "ws",
	isStartingToken: (tok: token) => tok.type == tokenType.whitespace,
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken : lexicon = {
			type: "ws",
			children: [startingToken]
		};
		
		while (tokenizer.hasNext()) {
			var tok = tokenizer.peek();
			if (tok.type != tokenType.whitespace) {
				break;
			}
			retToken.children.push(tok);
			tokenizer.next();
		}
		return retToken;
	}
};