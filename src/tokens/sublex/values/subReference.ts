import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import accessor from "./accessor";
import funcCall from "./funcCall";

import locale from "../../../locale.json";

export default <sublexer>{
	isStartingToken: (tok?: token) => tok && tok.type == tokenType.symbol && tok.value == ".",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.subreference, tok, <(lexicon | token)[]>[]);

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];

		if (tok.type != tokenType.identifier) {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				level: ProblemLevel.Error,
			});
			return retval;
		}
		retval.children.push(tok);

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];

		if (accessor.isStartingToken(tok)) {
			retval.children.push(accessor.lexer(tok, tokenizer));
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		}
		
		if (funcCall.isStartingToken(tok)) {
			retval.children.push(funcCall.lexer(tok, tokenizer));
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		}

		tokenizer.push(tok);

		retval.complete = true;
		return retval;
	},
};
