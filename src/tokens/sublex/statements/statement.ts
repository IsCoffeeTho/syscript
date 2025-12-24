import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import value from "../values/value";
import controlFlow from "./controlFlow";
import declaration from "./declaration";
import forLoop from "./forLoop";
import ifStatement from "./ifStatement";
import returnStatement from "./returnStatement";
import switchStatement from "./switchStatement";
import whileLoop from "./whileLoop";

import locale from "../../../locale.json";

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
		var lastToken = tok;
		if (ifStatement.isStartingToken(tok)) return ifStatement.lexer(tok, tokenizer);
		if (switchStatement.isStartingToken(tok)) return switchStatement.lexer(tok, tokenizer);
		if (forLoop.isStartingToken(tok)) return forLoop.lexer(tok, tokenizer);
		if (whileLoop.isStartingToken(tok)) return whileLoop.lexer(tok, tokenizer);
		if (declaration.isStartingToken(tok)) return declaration.lexer(tok, tokenizer);
		
		var retval: lexicon;
		
		if (controlFlow.isStartingToken(tok)) {
			retval = controlFlow.lexer(tok, tokenizer);
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		} else if (returnStatement.isStartingToken(tok)) {
			retval = returnStatement.lexer(tok, tokenizer);
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		} else if (value.isStartingToken(tok)) {
			retval = value.lexer(tok, tokenizer);
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		} else {
			tok.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
			return tok;
		}
		
		if (!tok) {
			tok = new token(tokenType.EOF, 0, 0);
			tok.problem = new Problem(locale.end_of_file, {
				filename: tokenizer.context.filename,
				level: ProblemLevel.Error,
			});
			return tok;
		}
		
		if (tok.type != tokenType.symbol || tok.value != ";") {
			tokenizer.push(tok);
			retval.problem = new Problem(locale.missing_semicolon, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
			return retval;
		}
		
		retval.children.end = tok;
		retval.complete = true;
		return retval;
	},
};
