import { lexicon, lexiconType, unknownLexicon, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, unknownToken, type token } from "../../tokenize";
import typeRef from "../typeSignature";
import { wsc } from "../removers";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.grapheme && tok.value == "...",
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.variadic_parameter, startingToken, {
			name: unknownToken,
			type: unknownLexicon
		});
		
		var tok = wsc(tokenizer);
		if (tok.type != tokenType.identifier) return retToken;
		retToken.children.name = tok;
		tok = wsc(tokenizer);
		if (tok.type != tokenType.symbol && tok.value != ":") return retToken;
		tok = wsc(tokenizer);
		if (!typeRef.isStartingToken(tok)) return retToken;
		retToken.children.type = typeRef.lexer(tok, tokenizer);
		
		retToken.complete = true;
		return retToken;
	},
};
