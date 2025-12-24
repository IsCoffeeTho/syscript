import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { token, tokenType } from "../../tokenize";
import codeBlock from "../statements/codeBlock";
import typeRef from "../typeSignature";
import { nextAfterWSC } from "../removers";
import paramList from "./paramList";
import { Problem, ProblemLevel } from "../../../errors/problem";

import locale from "../../../locale.json";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.identifier,
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.method, tok, {
			name: tok,
			params: <lexicon | undefined>undefined,
			returnType: <lexicon | undefined>undefined,
			routine: <lexicon | undefined>undefined,
		});

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (!paramList.isStartingToken(tok)) {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
			return retval;
		}
		retval.children.params = paramList.lexer(tok, tokenizer);

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (tok.type == tokenType.symbol && tok.value == ":") {
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
			if (!typeRef.isStartingToken(tok)) {
				retval.problem = new Problem(locale.unexpected_token, {
					filename: tokenizer.context.filename,
					line: tok.line,
					col: tok.col,
					size: tok.value.length,
					level: ProblemLevel.Error,
				});
				return retval;
			}
			retval.children.returnType = typeRef.lexer(tok, tokenizer);
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		}
		
		if (!codeBlock.isStartingToken(tok)) {
			retval.problem = new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
			return retval;
		}
		retval.children.routine = codeBlock.lexer(tok, tokenizer);
		
		retval.complete = true;
		return retval;
	},
};
