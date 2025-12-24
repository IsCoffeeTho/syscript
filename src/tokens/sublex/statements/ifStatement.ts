import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import codeBlock from "./codeBlock";
import parenthEnclosed from "../values/parenthEnclosed";
import statement from "./statement";
import { Problem, ProblemLevel } from "../../../errors/problem";

import locale from "../../../locale.json";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.identifier && tok.value == "if",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.if_statement, tok, {
			start: tok,
			condition: <lexicon | undefined>undefined,
			routine: <lexicon | undefined>undefined,
			else: <lexicon | undefined>undefined,
		});

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (!parenthEnclosed.isStartingToken(tok)) {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
			return retval;
		}
		retval.children.condition = parenthEnclosed.lexer(tok, tokenizer);

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

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (tok.type != tokenType.identifier || tok.value != "else") {
			tokenizer.push(tok);
			retval.complete = true;
			return retval;
		}

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];

		if (codeBlock.isStartingToken(tok)) retval.children.else = codeBlock.lexer(tok, tokenizer);
		else if (statement.isStartingToken(tok)) retval.children.else = statement.lexer(tok, tokenizer);
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
