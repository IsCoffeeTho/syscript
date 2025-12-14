import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { token, tokenType } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import typeSignature from "../typeSignature";
import value from "../values/value";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.keyword && (tok.value == "let" || tok.value == "const"),
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.declaration, tok, {
			start: tok,
			name: <token | undefined>undefined,
			type: <lexicon | undefined>undefined,
			initialValue: <lexicon | undefined>undefined,
			end: <token | undefined>undefined,
		});
		
		tok = nextAfterWSC(tokenizer);
		if (tok.type != tokenType.identifier) return retval;
		retval.children.name = tok;
		
		tok = nextAfterWSC(tokenizer);
		if (tok.type != tokenType.symbol || tok.value != ":") return retval;
		
		tok = nextAfterWSC(tokenizer);
		if (!typeSignature.isStartingToken(tok)) return retval;
		retval.children.type = typeSignature.lexer(tok, tokenizer);
		
		
		tok = nextAfterWSC(tokenizer);
		if (tok.type == tokenType.symbol && tok.value == "=") {
			tok = nextAfterWSC(tokenizer);
			if (!value.isStartingToken(tok)) return retval;
			retval.children.initialValue = value.lexer(tok, tokenizer);
			tok = nextAfterWSC(tokenizer);
		}
		if (tok.type != tokenType.symbol || tok.value != ";") return retval;
		
		retval.children.end = tok;
		retval.complete = true;
		return retval;
	},
};
