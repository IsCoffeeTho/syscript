import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";

import locale from "../../../locale.json";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.symbol && tok.value == "'",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.character_literal, tok, {
			start: tok,
			tokens: <token[]>[],
			end: <token | undefined>undefined,
		});

		var escape = false;
		while (tokenizer.hasNext()) {
			[lastToken, tok] = [tok, tokenizer.next()];
			if (!escape && tok.type == tokenType.symbol && tok.value == retval.children.start.value) {
				retval.children.end = tok;
				retval.complete = true;
				return retval;
			}
			escape = (tok.type == tokenType.symbol && tok.value == "\\");
			retval.children.tokens.push(tok);
		}
		retval.problem = new Problem(locale.unexpected_token, {
			filename: tokenizer.context.filename,
			line: lastToken.line,
			col: lastToken.col,
			size: lastToken.value.length,
			level: ProblemLevel.Error
		});
		return retval;
	},
};
