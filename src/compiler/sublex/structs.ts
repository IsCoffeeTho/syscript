import type { lexicon, sublexer } from "../lexer";
import type { parseMachine } from "../parseMachine";
import { tokenType, type token } from "../tokenize";

export default <sublexer>{
	name: "struct",
	isStartingToken: (tok: token) => (tok.type == tokenType.keyword && tok.value == "struct"),
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		return <lexicon>{
			type: "struct",
			children: [startingToken]
		};
	}
};