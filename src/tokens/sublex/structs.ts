import { lexicon, lexiconType, type sublexer } from "../lexer";
import type { parseMachine } from "../parseMachine";
import { tokenType, type token } from "../tokenize";

export default <sublexer>{
	name: "struct",
	isStartingToken: (tok: token) => tok.type == tokenType.keyword && tok.value == "struct",
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		return new lexicon(lexiconType.struct_def, startingToken);
	},
};
