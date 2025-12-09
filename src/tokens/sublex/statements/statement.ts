import { lexicon, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token } from "../../tokenize";
import ifStatement from "./ifStatement";

export default <sublexer>{
	isStartingToken: (tok: token) => {
		if (ifStatement.isStartingToken(tok)) return true;
		return false;
	},
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		if (ifStatement.isStartingToken(tok)) return ifStatement.lexer(tok, tokenizer);
		
		var retToken: token | lexicon = tok;
		
		// other statements
		 
		// should the semicolon be optional?
		
		return retToken;
	},
};
