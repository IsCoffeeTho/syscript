import { lexicon, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import value from "../values/value";
import controlFlow from "./controlFlow";
import declaration from "./declaration";
import forLoop from "./forLoop";
import ifStatement from "./ifStatement";
import returnStatement from "./returnStatement";
import switchStatement from "./switchStatement";
import whileLoop from "./whileLoop";

export default <sublexer>{
	isStartingToken: (tok: token) => {
		if (ifStatement.isStartingToken(tok)) return true;
		if (switchStatement.isStartingToken(tok)) return true;
		if (whileLoop.isStartingToken(tok)) return true;
		if (forLoop.isStartingToken(tok)) return true;
		if (returnStatement.isStartingToken(tok)) return true;
		if (controlFlow.isStartingToken(tok)) return true;
		if (declaration.isStartingToken(tok)) return true;
		return (value.isStartingToken(tok));
	},
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		if (ifStatement.isStartingToken(tok)) return ifStatement.lexer(tok, tokenizer);
		if (switchStatement.isStartingToken(tok)) return switchStatement.lexer(tok, tokenizer);
		if (forLoop.isStartingToken(tok)) return forLoop.lexer(tok, tokenizer);
		if (whileLoop.isStartingToken(tok)) return whileLoop.lexer(tok, tokenizer);
		if (declaration.isStartingToken(tok)) return declaration.lexer(tok, tokenizer);
		
		var retval: lexicon;
		
		if (controlFlow.isStartingToken(tok)) {
			retval = controlFlow.lexer(tok, tokenizer);
			tok = nextAfterWSC(tokenizer);
		} else if (returnStatement.isStartingToken(tok)) {
			retval = returnStatement.lexer(tok, tokenizer);
			tok = nextAfterWSC(tokenizer);
		} else if (value.isStartingToken(tok)) {
			retval = value.lexer(tok, tokenizer);
			tok = nextAfterWSC(tokenizer);
		} else
			return tok;
		
		retval.complete = (tok.type == tokenType.symbol && tok.value == ";");
		if (!retval.complete)
			tokenizer.push(tok);
		else
			retval.children.end = tok;
		return retval;
		
	},
};
