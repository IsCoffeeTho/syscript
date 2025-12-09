import { type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token } from "../../tokenize";
import ifStatement from "./ifStatement";

export default <sublexer>{
	isStartingToken: (tok: token) => {
		if (ifStatement.isStartingToken(tok)) return true;
		return false;
	},
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		if (ifStatement.isStartingToken(startingToken)) return ifStatement.lexer(startingToken, tokenizer);
		return startingToken;
	},
};
