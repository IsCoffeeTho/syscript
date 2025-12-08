import { lexicon, lexiconType, unknownLexicon, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { token, tokenType, unknownToken } from "../../tokenize";
import codeBlock from "../statements/codeBlock";
import typeRef from "../typeSignature";
import { wsc } from "../removers";
import paramList from "./paramList";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.keyword && tok.value == "fn",
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.function, startingToken, {
			name: unknownToken,
			params: unknownLexicon,
			returnType: unknownLexicon,
			routine: unknownLexicon
		});

		var tok = wsc(tokenizer);
		if (tok.type != tokenType.identifier) return retToken;
		retToken.children.name = tok;


		tok = wsc(tokenizer);
		if (!paramList.isStartingToken(tok)) return retToken;
		retToken.children.params = paramList.lexer(tok, tokenizer);
		
		tok = wsc(tokenizer);
		if (tok.type != tokenType.symbol || tok.value != ":") return retToken;

		tok = wsc(tokenizer);
		if (!typeRef.isStartingToken(tok)) return retToken;
		retToken.children.returnType = typeRef.lexer(tok, tokenizer);

		wsc(tokenizer);

		tok = tokenizer.next();
		if (!codeBlock.isStartingToken(tok)) return retToken;
		retToken.children.routine = codeBlock.lexer(tok, tokenizer);

		retToken.complete = true;
		return retToken;
	},
};
