import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import typeRef from "../typeSignature";
import { nextAfterWSC } from "../removers";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.grapheme && tok.value == "...",
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.variadic_parameter, startingToken, {
			name: <token | undefined>undefined,
			type: <lexicon | undefined>undefined,
		});

		var tok = nextAfterWSC(tokenizer);
		if (tok.type != tokenType.identifier) return retToken;
		retToken.children.name = tok;
		tok = nextAfterWSC(tokenizer);
		if (tok.type != tokenType.symbol || tok.value != ":") return retToken;
		tok = nextAfterWSC(tokenizer);
		if (!typeRef.isStartingToken(tok)) return retToken;
		retToken.children.type = typeRef.lexer(tok, tokenizer);

		retToken.complete = true;
		return retToken;
	},
};
