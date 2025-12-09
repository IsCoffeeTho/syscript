import { lexicon, lexiconType, unknownLexicon, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { token, tokenType, unknownToken } from "../../tokenize";
import codeBlock from "../statements/codeBlock";
import typeRef from "../typeSignature";
import { nextAfterWSC } from "../removers";
import paramList from "./paramList";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.keyword && tok.value == "fn",
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.function, startingToken, {
			name: unknownToken,
			params: unknownLexicon,
			returnType: <lexicon | undefined>undefined,
			routine: unknownLexicon,
		});

		var tok = nextAfterWSC(tokenizer);
		if (tok.type != tokenType.identifier) return retToken;
		retToken.children.name = tok;

		tok = nextAfterWSC(tokenizer);
		if (!paramList.isStartingToken(tok)) return retToken;
		retToken.children.params = paramList.lexer(tok, tokenizer);

		tok = nextAfterWSC(tokenizer);
		if (tok.type == tokenType.symbol && tok.value == ":") {
			tok = nextAfterWSC(tokenizer);
			if (!typeRef.isStartingToken(tok)) return retToken;
			retToken.children.returnType = typeRef.lexer(tok, tokenizer);
			tok = nextAfterWSC(tokenizer);
		} else if (!codeBlock.isStartingToken(tok)) return retToken;
		retToken.children.routine = codeBlock.lexer(tok, tokenizer);

		retToken.complete = true;
		return retToken;
	},
};
