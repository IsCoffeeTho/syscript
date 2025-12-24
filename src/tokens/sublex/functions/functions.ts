import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { token, tokenType } from "../../tokenize";
import codeBlock from "../statements/codeBlock";
import typeRef from "../typeSignature";
import { nextAfterWSC } from "../removers";
import paramList from "./paramList";
import { Problem, ProblemLevel } from "../../../errors/problem";

import locale from "../../../locale.json";
import method from "./method";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.identifier && tok.value == "fn",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.function, tok, {
			method: <lexicon | undefined>undefined
		});

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (!method.isStartingToken(tok)) {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
			return retval;
		}
		retval.children.method = method.lexer(tok, tokenizer);
		
		retval.complete = true;
		return retval;
	},
};
