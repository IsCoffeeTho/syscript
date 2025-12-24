import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import codeBlock from "./codeBlock";
import statement from "./statement";
import value from "../values/value";
import declaration from "./declaration";
import { Problem, ProblemLevel } from "../../../errors/problem";

import locale from "../../../locale.json";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.identifier && tok.value == "for",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.for_loop, tok, {
			start: tok,
			declaration: <lexicon | undefined>undefined,
			condition: <lexicon | undefined>undefined,
			mutation: <lexicon | undefined>undefined,
			routine: <lexicon | undefined>undefined,
		});

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (tok.type != tokenType.symbol || tok.value != "(") {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
			return retval;
		}

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (declaration.isStartingToken(tok)) {
			retval.children.declaration = declaration.lexer(tok, tokenizer);
		} else if (tok.type != tokenType.symbol || tok.value != ";") {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
			return retval;
		}

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (value.isStartingToken(tok)) {
			retval.children.condition = value.lexer(tok, tokenizer);
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		}
		if (tok.type != tokenType.symbol || tok.value != ";") {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
			return retval;
		}

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		retval.children.mutation = value.lexer(tok, tokenizer);

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (tok.type != tokenType.symbol || tok.value != ")") {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
			return retval;
		}

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (codeBlock.isStartingToken(tok)) retval.children.routine = codeBlock.lexer(tok, tokenizer);
		else if (statement.isStartingToken(tok)) retval.children.routine = statement.lexer(tok, tokenizer);
		else {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
			return retval;
		}

		retval.complete = true;
		return retval;
	},
};
