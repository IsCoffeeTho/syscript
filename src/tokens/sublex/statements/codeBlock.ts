import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";
import comments from "../comments/comments";
import { nextAfterWSC } from "../removers";
import statement from "./statement";

import locale from "../../../locale.json";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.symbol && tok.value == "{",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.code_block, tok, {
			start: tok,
			statements: <(lexicon | token)[]>[],
			end: <token | undefined>undefined,
		});
		var statements = retval.children.statements;
		
		while (tokenizer.hasNext()) {
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
			if (comments.isStartingToken(tok))
				statements.push(comments.lexer(tok, tokenizer));
			else if (statement.isStartingToken(tok))
				statements.push(statement.lexer(tok, tokenizer));
			else if (tok.type == tokenType.symbol && tok.value == "}") {
				retval.children.end = tok;
				retval.complete = true;
				return retval;
			} else
				statements.push(tok);
		}
		retval.problem = new Problem(locale.end_of_file, {
			filename: tokenizer.context.filename,
			line: tok.line,
			col: tok.col,
			size: tok.value.length,
			level: ProblemLevel.Error
		});
		return retval;
	},
};
