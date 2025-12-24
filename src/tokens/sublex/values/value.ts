import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import operator from "../operators/operator";
import { nextAfterWSC } from "../removers";
import singletonValue from "./singletonValue";

import locale from "../../../locale.json";
import { Problem, ProblemLevel } from "../../../errors/problem";

export default <sublexer>{
	isStartingToken: (tok?: token) => singletonValue.isStartingToken(tok),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.value, tok, [singletonValue.lexer(tok, tokenizer)]);

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		while (operator.isStartingToken(tok)) {
			retval.children.push(operator.lexer(tok, tokenizer));
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
			if (!singletonValue.isStartingToken(tok)) {
				retval.problem = new Problem(locale.unexpected_token, {
					filename: tokenizer.context.filename,
					line: tok.line,
					col: tok.col,
					level: ProblemLevel.Error,
				});
				return retval;
			}
			retval.children.push(singletonValue.lexer(tok, tokenizer));
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		}
		tokenizer.push(tok);
		retval.complete = true;
		return retval;
	},
};
