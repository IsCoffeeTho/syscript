import { Problem, ProblemLevel } from "../../../errors/problem";
import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";

import locale from "../../../locale.json";

export default <sublexer>{
	name: "comment_multi",
	isStartingToken: (tok: token) => tok && tok.type == tokenType.grapheme && tok.value == "/*",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var lastToken = tok;
		var retval = new lexicon(lexiconType.multi_comment, tok, <token[]>[tok]);

		while (tokenizer.hasNext()) {
			[lastToken, tok] = [lastToken, tokenizer.next()];
			retval.children.push(tok);
			if (tok.type == tokenType.grapheme && tok.value == "*/") {
				retval.complete = true;
				return retval;
			}
		}
		retval.problem = new Problem(locale.end_of_file, {
			filename: tokenizer.context.filename,
			line: lastToken.line,
			col: lastToken.col,
			size: lastToken.value.length,
			level: ProblemLevel.Error
		});
		return retval;
	},
};
