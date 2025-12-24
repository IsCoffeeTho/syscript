import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import parameter from "./parameter";
import variadicParam from "./variadicParam";

import locale from "../../../locale.json";
import { Problem, ProblemLevel } from "../../../errors/problem";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.symbol && tok.value == "(",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.param_list, tok, {
			start: tok,
			parameters: <lexicon[]>[],
			end: <token | undefined>undefined,
		});

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		while (parameter.isStartingToken(tok) || variadicParam.isStartingToken(tok)) {
			if (parameter.isStartingToken(tok)) {
				retval.children.parameters.push(parameter.lexer(tok, tokenizer));
			} else if (variadicParam.isStartingToken(tok)) {
				retval.children.parameters.push(variadicParam.lexer(tok, tokenizer));
				[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
				break;
			}
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
			if (tok.type != tokenType.symbol || tok.value != ",") break;
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		}
		if (tok.type != tokenType.symbol || tok.value != ")") {
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
