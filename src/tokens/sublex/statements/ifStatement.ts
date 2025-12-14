import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import codeBlock from "./codeBlock";
import parenthEnclosed from "../values/parenthEnclosed";
import statement from "./statement";

export default <sublexer>{
	isStartingToken: (tok: token) => (tok.type == tokenType.keyword && tok.value == "if"),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.if_statement, tok, {
			start: tok,
			condition: <lexicon | undefined>undefined,
			routine: <lexicon | undefined>undefined,
			else: <lexicon | undefined>undefined
		});
		
		tok = nextAfterWSC(tokenizer);
		if (!parenthEnclosed.isStartingToken(tok)) return retval;
		retval.children.condition = parenthEnclosed.lexer(tok, tokenizer);
		
		tok = nextAfterWSC(tokenizer);
		if (codeBlock.isStartingToken(tok))
			retval.children.routine = codeBlock.lexer(tok, tokenizer);
		else if (statement.isStartingToken(tok))
			retval.children.routine = statement.lexer(tok, tokenizer);
		else
			return retval;
		
		tok = nextAfterWSC(tokenizer);
		if (tok.type != tokenType.keyword || tok.value != "else") {
			tokenizer.push(tok);
			retval.complete = true;
			return retval;
		}
	
		tok = nextAfterWSC(tokenizer);
		
		if (codeBlock.isStartingToken(tok))
			retval.children.else = codeBlock.lexer(tok, tokenizer);
		else if (statement.isStartingToken(tok))
			retval.children.else = statement.lexer(tok, tokenizer);
		else
			return retval;
						
			retval.complete = true;
			return retval;
	},
};
