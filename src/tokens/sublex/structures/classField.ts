import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import typeSignature from "../typeSignature";

import locale from "../../../locale.json";
import field from "./field";
import method from "../functions/method";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.identifier,
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var startToken = tok;
		
		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (tok.type == tokenType.symbol && tok.value == ":") {
			tokenizer.push(tok);
			return field.lexer(startToken, tokenizer);
		} else if (tok.type == tokenType.symbol && tok.value == "(") {
			tokenizer.push(tok);
			return method.lexer(startToken, tokenizer);
		}
		
		var retval = new lexicon(lexiconType.field, startToken, {
			name: startToken,
			type: <token | undefined>undefined,
		});
		retval.problem = new Problem(locale.unexpected_token, {
			filename: tokenizer.context.filename,
			line: tok.line,
			col: tok.col,
			level: ProblemLevel.Error,
		});
		return retval;
	},
};
