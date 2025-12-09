import { lexicon, lexiconType, unknownLexicon, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, unknownToken, type token } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import parameter from "./parameter";
import variadicParam from "./variadicParam";

export default <sublexer>{
	isStartingToken: (tok: token) => (tok.type == tokenType.symbol && tok.value == "("),
	lexer: (startingToken: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.param_list, startingToken, <lexicon[]>[]);
		var tok = tokenizer.peek();
		while (tokenizer.hasNext()) {
			tok = nextAfterWSC(tokenizer);
			if (parameter.isStartingToken(tok)) {
				retToken.children.push(parameter.lexer(tok, tokenizer));
			} else if (variadicParam.isStartingToken(tok)) {
				retToken.children.push(variadicParam.lexer(tok, tokenizer));
				tok = nextAfterWSC(tokenizer);
				break;
			} else {
				return retToken;
			}
			tok = nextAfterWSC(tokenizer);
			if (tok.type == tokenType.symbol && tok.value == ',')
				continue;
			break;
		}
		if (tok.type != tokenType.symbol || tok.value != ')') return retToken;
		
		retToken.size = (tok.position - startingToken.position) + tok.value.length;
		retToken.complete = true;
		return retToken;
	}
};