import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import value from "../values/value";

import locale from "../../../locale.json";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && ((tok.type == tokenType.grapheme && tok.value == "[]") || (tok.type == tokenType.symbol && tok.value == "[")),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.array_literal, tok, {
			start: tok,
			values: <lexicon[]>[],
			end: <token | undefined>undefined,
		});

		if (tok.type == tokenType.grapheme && tok.value == "[]") {
			retval.children.end = tok;
			retval.complete = true;
			return retval;
		}

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		while (value.isStartingToken(tok)) {
			retval.children.values.push(value.lexer(tok, tokenizer));
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
			if (tok.type != tokenType.symbol || tok.value != ",") break;
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		}
		if (tok.type != tokenType.symbol || tok.value != "]") {
			retval.problem = new Problem(locale.unexpected_token, {
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
