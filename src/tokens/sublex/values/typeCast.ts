import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import typeSignature from "../typeSignature";

export default <sublexer>{
	isStartingToken: (tok: token) => (tok.type == tokenType.symbol && tok.value == "<"),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.type_cast, tok, {
			signature: <lexicon | undefined>undefined
		});
		
		tok = nextAfterWSC(tokenizer);
		if (!typeSignature.isStartingToken(tok)) return retval;
		retval.children.signature = typeSignature.lexer(tok, tokenizer);
	
		tok = nextAfterWSC(tokenizer);
		if (tok.type != tokenType.symbol || tok.value != ">") return retval;
		
		retval.complete = true;
		return retval;
	},
};
