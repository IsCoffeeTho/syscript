import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";

import locale from "../../../locale.json";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.numeric,
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.number_literal, tok, [tok]);
		retval.complete = true;

		var zeroStart = tok.value == "0";

		tok = tokenizer.next();
		if (tok.type == tokenType.symbol && tok.value == ".") {
			retval.complete = false;

			retval.type = lexiconType.float_literal;
			retval.children.push(tok);
			tok = tokenizer.next();
			if (tok.type != tokenType.numeric) {
				retval.problem = new Problem(locale.unexpected_token, {
					filename: tokenizer.context.filename,
					line: tok.line,
					col: tok.col,
					size: tok.value.length,
					level: ProblemLevel.Error,
				});
				return retval;
			}
			retval.children.push(tok);

			retval.complete = true;
		} else if (zeroStart && tok.type == tokenType.identifier && (tok.value.startsWith("x") || tok.value.startsWith("b"))) {
			retval.children.push(tok);
		} else {
			tokenizer.push(tok);
		}

		return retval;
	},
};
