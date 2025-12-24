import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import typeRef from "../typeSignature";
import { nextAfterWSC } from "../removers";
import { Problem, ProblemLevel } from "../../../errors/problem";

import locale from "../../../locale.json";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.grapheme && tok.value == "...",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.variadic_parameter, tok, {
			name: <token | undefined>undefined,
			type: <lexicon | undefined>undefined,
		});

		var [lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (tok.type != tokenType.identifier) {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
			return retval;
		}
		retval.children.name = tok;
		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (tok.type != tokenType.symbol || tok.value != ":") {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error
			});
			return retval;
		}
		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (!typeRef.isStartingToken(tok)) return retval;
		retval.children.type = typeRef.lexer(tok, tokenizer);

		retval.complete = true;
		return retval;
	},
};
