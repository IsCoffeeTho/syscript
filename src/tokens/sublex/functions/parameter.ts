import { lexicon, lexiconType, unknownLexicon, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, unknownToken, type token } from "../../tokenize";
import typeRef from "../typeSignature";
import { wsc } from "../removers";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.identifier,
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.parameter, startingToken, {
			name: startingToken,
			type: unknownLexicon,
		});
		var tok = wsc(tokenizer);
		if (tok.type != tokenType.symbol && tok.value != ":") return retToken;

		tok = wsc(tokenizer);
		if (!typeRef.isStartingToken(tok)) return retToken;
		retToken.children.type = typeRef.lexer(tok, tokenizer);

		retToken.complete = true;
		return retToken;
	},
};
