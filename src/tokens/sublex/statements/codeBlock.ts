import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";
import comments from "../comments/comments";
import { nextAfterWSC } from "../removers";
import statement from "./statement";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.symbol && tok.value == "{",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.code_block, tok, {
			start: tok,
			statements: <(lexicon | token)[]>[],
			end: <token | undefined>undefined,
		});
		
		var statements = retval.children.statements;
		
		while (tokenizer.hasNext()) {
			tok = nextAfterWSC(tokenizer);
			if (comments.isStartingToken(tok))
				statements.push(comments.lexer(tok, tokenizer));
			else if (statement.isStartingToken(tok))
				statements.push(statement.lexer(tok, tokenizer));
			else if (tok.type == tokenType.symbol && tok.value == "}") {
				retval.children.end = tok;
				retval.complete = true;
				break; 
			} else
				statements.push(tok);
		}
		
		
		return retval;
	},
};
