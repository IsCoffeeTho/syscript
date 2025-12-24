import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import typeSignature from "../typeSignature";

import locale from "../../../locale.json";

export default <sublexer>{
	isStartingToken: (tok?: token) => tok && tok.type == tokenType.symbol && tok.value == "<",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.type_cast, tok, {
			signature: <lexicon | undefined>undefined,
		});

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (!typeSignature.isStartingToken(tok)) {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				level: ProblemLevel.Error,
			});
			return retval;
		}
		retval.children.signature = typeSignature.lexer(tok, tokenizer);

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (tok.type != tokenType.symbol || tok.value != ">") {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				level: ProblemLevel.Error,
			});
			return retval;
		}

		retval.complete = true;
		return retval;
	},
};
