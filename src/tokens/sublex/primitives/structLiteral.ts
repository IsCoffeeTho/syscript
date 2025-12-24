import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import value from "../values/value";

import locale from "../../../locale.json";
import property from "../structures/property";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.symbol && tok.value == "{",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.struct_literal, tok, {
			start: tok,
			properties: <lexicon[]>[],
			end: <token | undefined>undefined,
		});

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		while (property.isStartingToken(tok)) {
			retval.children.properties.push(property.lexer(tok, tokenizer));
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
			if (tok.type != tokenType.symbol || tok.value != ",") break;
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		}
		if (!tok) {
			retval.problem = new Problem(locale.end_of_file, {
				filename: tokenizer.context.filename,
				line: lastToken.line,
				col: lastToken.col,
				size: lastToken.value.length,
				level: ProblemLevel.Error,
			});
			return retval;
		}
		
		if (tok.type != tokenType.symbol || tok.value != "}") {
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
