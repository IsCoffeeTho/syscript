import type { lexicon, sublexer } from "../lexer";
import type { parseMachine } from "../parseMachine";
import { tokenType, type token } from "../tokenize";

export default <sublexer>{
	name: "function",
	isStartingToken: (tok: token) => (tok.type == tokenType.keyword && tok.value == "fn"),
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var fnToken : lexicon = {
			type: "function",
			children: [
				startingToken
			]
		};
		
		
		
		return fnToken;
	}
};