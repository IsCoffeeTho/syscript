import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import typeRef from "../typeSignature";
import { nextAfterWSC } from "../removers";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.identifier,
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.parameter, startingToken, {
			name: <token | undefined>undefined,
			type: <lexicon | undefined>undefined,
		});
		var tok = nextAfterWSC(tokenizer);
		if (tok.type != tokenType.symbol || tok.value != ":") return retval;

		tok = nextAfterWSC(tokenizer);
		if (!typeRef.isStartingToken(tok)) return retval;
		retval.children.type = typeRef.lexer(tok, tokenizer);

		retval.complete = true;
		return retval;
	},
};
