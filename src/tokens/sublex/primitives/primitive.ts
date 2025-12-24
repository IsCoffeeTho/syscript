import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token } from "../../tokenize";
import arrays from "./arrays";
import booleans from "./booleans";
import chars from "./chars";
import numbers from "./numbers";
import strings from "./strings";

import locale from "../../../locale.json";
import structLiteral from "./structLiteral";


export default <sublexer>{
	isStartingToken: (tok: token) => {
		if (numbers.isStartingToken(tok)) return true;
		if (chars.isStartingToken(tok)) return true;
		if (booleans.isStartingToken(tok)) return true;
		if (strings.isStartingToken(tok)) return true;
		if (structLiteral.isStartingToken(tok)) return true;
		return arrays.isStartingToken(tok);
	},
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.primitive, tok, {
			component: <lexicon | undefined>undefined,
		});

		if (numbers.isStartingToken(tok)) retval.children.component = numbers.lexer(tok, tokenizer);
		else if (chars.isStartingToken(tok)) retval.children.component = chars.lexer(tok, tokenizer);
		else if (booleans.isStartingToken(tok)) retval.children.component = booleans.lexer(tok, tokenizer);
		else if (strings.isStartingToken(tok)) retval.children.component = strings.lexer(tok, tokenizer);
		else if (structLiteral.isStartingToken(tok)) retval.children.component = structLiteral.lexer(tok, tokenizer);
		else if (arrays.isStartingToken(tok)) retval.children.component = arrays.lexer(tok, tokenizer);
		else {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error
			});
			return retval;
		}

		retval.complete = true;
		return retval;
	},
};
