import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import parenthEnclosed from "../values/parenthEnclosed";

import locale from "../../../locale.json";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.identifier && tok.value == "switch",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.if_statement, tok, {
			start: tok,
			value: <lexicon | undefined>undefined,
			cases: <lexicon[]>[],
		});

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (!parenthEnclosed.isStartingToken(tok)) {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length, level: ProblemLevel.Error });
			return retval;
		}
		retval.children.value = parenthEnclosed.lexer(tok, tokenizer);

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (tok.type != tokenType.symbol || tok.value != "{") {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length, level: ProblemLevel.Error });
			return retval;
		}

		throw new Error("Not Implemented");

		retval.complete = true;

		return retval;
	},
};
