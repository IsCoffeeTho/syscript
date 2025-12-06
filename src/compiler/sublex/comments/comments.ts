import type { lexicon, sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import multiLine from "./multiLine";
import singleLine from "./singleLine";


export default <sublexer> {
	name: "comment",
	isStartingToken: (tok: token) => (singleLine.isStartingToken(tok) || multiLine.isStartingToken(tok)),
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken : lexicon = {
			type: "comment",
			children: []
		};
		if (startingToken.value == "//")
			retToken.children.push(singleLine.lexer(startingToken, tokenizer));
		else if (startingToken.value == "/*")
			retToken.children.push(multiLine.lexer(startingToken, tokenizer));
		
		return retToken;
	}
};