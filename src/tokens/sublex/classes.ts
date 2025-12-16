import { lexicon, lexiconType, type sublexer } from "../lexer";
import type { parseMachine } from "../parseMachine";
import { tokenType, type token } from "../tokenize";

export default <sublexer>{
	name: "class",
	isStartingToken: (tok: token) => tok.type == tokenType.identifier && tok.value == "class",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		return new lexicon(lexiconType.class_def, tok);
	},
};
