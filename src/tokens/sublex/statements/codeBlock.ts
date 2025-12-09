import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType, unknownToken } from "../../tokenize";
import comments from "../comments/comments";
import { nextAfterWSC } from "../removers";
import statement from "./statement";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.symbol && tok.value == "{",
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.code_block, startingToken, {
			start: startingToken,
			statements: <(lexicon | token)[]>[],
			end: <token | undefined>undefined,
		});
		
		var statements = retToken.children.statements;
		
		while (tokenizer.hasNext()) {
			var tok = nextAfterWSC(tokenizer);
			if (comments.isStartingToken(tok))
				statements.push(comments.lexer(tok, tokenizer));
			else if (statement.isStartingToken(tok))
				statements.push(statement.lexer(tok, tokenizer));
			else if (tok.type == tokenType.symbol && tok.value == "}") {
				retToken.children.end = tok;
				retToken.complete = true;
				break; 
			} else
				statements.push(tok);
		}
		
		
		return retToken;
	},
};
