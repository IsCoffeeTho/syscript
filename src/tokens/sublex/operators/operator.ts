import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token } from "../../tokenize";
import arithmeticOperator from "./arithmeticOperator";
import assignmentOperator from "./assignmentOperator";
import comparativeOperator from "./comparativeOperator";
import logicalOperator from "./logicalOperator";

export default <sublexer>{
	isStartingToken: (tok: token) => {
		if (logicalOperator.isStartingToken(tok)) return true;
		if (comparativeOperator.isStartingToken(tok)) return true;
		if (arithmeticOperator.isStartingToken(tok)) return true;
		if (assignmentOperator.isStartingToken(tok)) return true;
		return false;
	},
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		if (logicalOperator.isStartingToken(tok)) return logicalOperator.lexer(tok, tokenizer);
		if (comparativeOperator.isStartingToken(tok)) return comparativeOperator.lexer(tok, tokenizer);
		if (arithmeticOperator.isStartingToken(tok)) return arithmeticOperator.lexer(tok, tokenizer);
		if (assignmentOperator.isStartingToken(tok)) return assignmentOperator.lexer(tok, tokenizer);
		return;
	},
};
