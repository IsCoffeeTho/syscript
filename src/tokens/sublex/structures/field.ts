import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";
import parameter from "../functions/parameter";
import { nextAfterWSC } from "../removers";
import typeSignature from "../typeSignature";

import locale from "../../../locale.json";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.identifier,
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.field, tok, {
			name: tok,
			type: <lexicon | undefined>undefined,
		});

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (tok.type != tokenType.symbol || tok.value != ":") {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				level: ProblemLevel.Error,
			});
			return retval;
		}
		
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
		retval.children.type = typeSignature.lexer(tok, tokenizer);
		
		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (tok.type != tokenType.symbol || tok.value != ";") {
			retval.problem = new Problem(locale.missing_semicolon, {
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
