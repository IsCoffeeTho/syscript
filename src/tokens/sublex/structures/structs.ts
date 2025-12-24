import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";

import locale from "../../../locale.json";
import field from "./field";

export default <sublexer>{
	isStartingToken: (tok: token) => tok && tok.type == tokenType.identifier && tok.value == "struct",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.struct_def, tok, {
			start: tok,
			name: <token | undefined>undefined,
			extends: <token[]>[],
			properties: <lexicon[]>[],
			end: <token | undefined>undefined,
		});

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (tok.type != tokenType.identifier) {
			new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
		}
		retval.children.name = tok;

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		if (tok.type == tokenType.identifier && tok.value == "extends") {
			while (tokenizer.hasNext()) {
				[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
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
				retval.children.extends.push(tok);
				[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
				if (tok.type == tokenType.symbol && tok.value == "{") break;
				if (tok.type != tokenType.symbol || tok.value != ",") {
					retval.problem = new Problem(locale.unexpected_token, {
						filename: tokenizer.context.filename,
						line: tok.line,
						col: tok.col,
						size: tok.value.length,
						level: ProblemLevel.Error,
					});
					return retval;
				}
			}
		}
		if (tok.type != tokenType.symbol || tok.value != "{") {
			new Problem(locale.unexpected_token, {
				filename: tokenizer.context.filename,
				line: tok.line,
				col: tok.col,
				size: tok.value.length,
				level: ProblemLevel.Error,
			});
			return retval;
		}

		[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		while (tokenizer.hasNext()) {
			if (tok.type == tokenType.symbol && tok.value == "}") break;
			if (!field.isStartingToken(tok)) {
				retval.problem = new Problem(locale.unexpected_token, {
					filename: tokenizer.context.filename,
					line: tok.line,
					col: tok.col,
					size: tok.value.length,
					level: ProblemLevel.Error,
				});
				return retval;
			}
			retval.children.properties.push(field.lexer(tok, tokenizer));
			[lastToken, tok] = [tok, nextAfterWSC(tokenizer)];
		}
		
		retval.children.end = tok;
		retval.complete = true;
		return retval;
	},
};
