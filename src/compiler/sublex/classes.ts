import type { lexicon, sublexer } from "../lexer";
import type { parseMachine } from "../parseMachine";
import { tokenType, type token } from "../tokenize";

export default <sublexer>{
	name: "class",
	isStartingToken: (tok: token) => (tok.type == tokenType.keyword && tok.value == "class"),
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		return <lexicon>{
			type: "class",
			children: [startingToken]
		};
	}
};