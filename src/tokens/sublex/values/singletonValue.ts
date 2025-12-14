import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import primitive from "../primitives/primitive";
import { nextAfterWSC } from "../removers";
import accessor from "./accessor";
import funcCall from "./funcCall";
import parenthEnclosed from "./parenthEnclosed";
import subReference from "./subReference";
import typeCast from "./typeCast";

var prefix = (tok: token) => {
	if (tok.type == tokenType.symbol && (tok.value == "!" || tok.value == "~" || tok.value == "-")) return true;
	return false;
};

export default <sublexer>{
	isStartingToken: (tok: token) => {
		if (prefix(tok) || typeCast.isStartingToken(tok)) return true;
		if (tok.type == tokenType.grapheme && (tok.value == "++" || tok.value == "--")) return true;
		if (parenthEnclosed.isStartingToken(tok)) return true;
		if (primitive.isStartingToken(tok)) return true;
		if (tok.type == tokenType.identifier) return true;
		return false;
	},
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retval = new lexicon(lexiconType.singleton_value, tok, {
			prefixes: <(lexicon | token)[]>[],
			component: <lexicon | token | undefined>undefined,
			suffixes: <(lexicon | token)[]>[],
		});

		if (typeCast.isStartingToken(tok)) {
			retval.children.prefixes = [typeCast.lexer(tok, tokenizer)];
		} else if (tok.type == tokenType.grapheme && (tok.value == "++" || tok.value == "--")) {
			retval.children.prefixes = [tok];
		} else
			while (prefix(tok)) {
				retval.children.prefixes.push(tok);
				tok = tokenizer.next();
			}
		

		if (parenthEnclosed.isStartingToken(tok)) retval.children.component = parenthEnclosed.lexer(tok, tokenizer);
		else if (primitive.isStartingToken(tok)) retval.children.component = primitive.lexer(tok, tokenizer);
		else if (tok.type == tokenType.identifier) retval.children.component = tok;
		else return retval;

		tok = nextAfterWSC(tokenizer);

		while (subReference.isStartingToken(tok) || accessor.isStartingToken(tok) || funcCall.isStartingToken(tok)) {
			if (accessor.isStartingToken(tok))
				retval.children.suffixes.push(accessor.lexer(tok, tokenizer));
			if (funcCall.isStartingToken(tok))
				retval.children.suffixes.push(funcCall.lexer(tok, tokenizer));
			if (subReference.isStartingToken(tok))
				retval.children.suffixes.push(subReference.lexer(tok, tokenizer));
			tok = nextAfterWSC(tokenizer);
		}
		
		if (tok.type == tokenType.grapheme && (tok.value == "++" || tok.value == "--")) {
			retval.children.suffixes.push(tok);
		} else {
			tokenizer.push(tok);
		}

		retval.complete = true;
		return retval;
	},
};
