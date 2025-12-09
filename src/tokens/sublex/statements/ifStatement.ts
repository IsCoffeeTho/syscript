import { lexicon, lexiconType, unknownLexicon, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType, unknownToken } from "../../tokenize";
import comments from "../comments/comments";
import { nextAfterWS, nextAfterWSC } from "../removers";
import codeBlock from "./codeBlock";
import parenthEnclosed from "../values/parenthEnclosed";
import statement from "./statement";

export default <sublexer>{
	isStartingToken: (tok: token) => (tok.type == tokenType.keyword && tok.value == "if"),
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.if_statement, startingToken, {
			start: startingToken,
			condition: unknownLexicon,
			routine: unknownLexicon,
			else: <token | undefined>undefined,
			elseRoutine: <lexicon | undefined>undefined
		});
		
		var tok = nextAfterWSC(tokenizer);
		if (!parenthEnclosed.isStartingToken(tok)) return retToken;
		retToken.children.condition = parenthEnclosed.lexer(tok, tokenizer);
		
		tok = nextAfterWSC(tokenizer);
		if (codeBlock.isStartingToken(tok))
			retToken.children.routine = codeBlock.lexer(tok, tokenizer);
		else if (statement.isStartingToken(tok))
			retToken.children.routine = statement.lexer(tok, tokenizer);
		else
			return retToken;
		
		retToken.complete = true;
			
		tok = nextAfterWSC(tokenizer);
		while (tok.type != tokenType.keyword && tok.value != "else") {
			
		}
		
		return retToken;
	},
};
