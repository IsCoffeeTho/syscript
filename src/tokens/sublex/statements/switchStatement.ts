import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { type token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import parenthEnclosed from "../values/parenthEnclosed";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.identifier && tok.value == "switch",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.if_statement, tok, {
			start: tok,
			value: <lexicon | undefined>undefined,
			cases: <lexicon[]>[],
		});

		tok = nextAfterWSC(tokenizer);
		if (!parenthEnclosed.isStartingToken(tok)) return retval;
		retval.children.value = parenthEnclosed.lexer(tok, tokenizer);

		tok = nextAfterWSC(tokenizer);
		if (tok.type != tokenType.symbol || tok.value != "{") return retval;
		
		throw new Error("Not Implemented");

		retval.complete = true;

		return retval;
	},
};
