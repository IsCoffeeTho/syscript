import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import { nextAfterWSC } from "../removers";
import parameter from "./parameter";
import variadicParam from "./variadicParam";

export default <sublexer>{
	isStartingToken: (tok: token) => tok.type == tokenType.symbol && tok.value == "(",
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.param_list, tok, {
			start: tok,
			parameters: <lexicon[]>[],
			end: <token | undefined>undefined,
		});
		
		tok = nextAfterWSC(tokenizer);
		while (parameter.isStartingToken(tok) || variadicParam.isStartingToken(tok)) {
			if (parameter.isStartingToken(tok)) {
				retval.children.parameters.push(parameter.lexer(tok, tokenizer));
			} else if (variadicParam.isStartingToken(tok)) {
				retval.children.parameters.push(variadicParam.lexer(tok, tokenizer));
				tok = nextAfterWSC(tokenizer);
				break;
			}
			tok = nextAfterWSC(tokenizer);
			if (tok.type != tokenType.symbol || tok.value != ",") break;
			tok = nextAfterWSC(tokenizer);
		}
		if (tok.type != tokenType.symbol || tok.value != ")") return retval;
		retval.children.end = tok;
		retval.complete = true;
		return retval;
	}
};
