import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { token, tokenType } from "../../tokenize";
import codeBlock from "../statements/codeBlock";
import typeRef from "../typeSignature";
import { nextAfterWSC } from "../removers";
import paramList from "./paramList";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.keyword && tok.value == "fn",
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.function, startingToken, {
			name: <token | undefined>undefined,
			params: <lexicon | undefined>undefined,
			returnType: <lexicon | undefined>undefined,
			routine: <lexicon | undefined>undefined,
		});

		var tok = nextAfterWSC(tokenizer);
		if (tok.type != tokenType.identifier) return retval;
		retval.children.name = tok;

		tok = nextAfterWSC(tokenizer);
		if (!paramList.isStartingToken(tok)) return retval;
		retval.children.params = paramList.lexer(tok, tokenizer);

		tok = nextAfterWSC(tokenizer);
		if (tok.type == tokenType.symbol && tok.value == ":") {
			tok = nextAfterWSC(tokenizer);
			if (!typeRef.isStartingToken(tok)) return retval;
			retval.children.returnType = typeRef.lexer(tok, tokenizer);
			tok = nextAfterWSC(tokenizer);
		} else if (!codeBlock.isStartingToken(tok)) return retval;
		retval.children.routine = codeBlock.lexer(tok, tokenizer);

		retval.complete = true;
		return retval;
	},
};
