import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import value from "../values/value";

import locale from "../../../locale.json";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.identifier && tok.value == "return",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.if_statement, tok, {
			start: tok,
			value: <lexicon | undefined>undefined,
		});

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (!value.isStartingToken(tok)) {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
			return retval;
		}
		retval.children.value = value.lexer(tok, tokenizer);

		retval.complete = true;
		return retval;
	},
};
