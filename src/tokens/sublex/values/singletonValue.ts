import { lexicon, lexiconType, type sublexer } from "../../lexer";
import type { parseMachine } from "../../parseMachine";
import { tokenType, type token } from "../../tokenize";
import primitive from "../primitives/primitive";
import { nextAfterWSC } from "../removers";
import parenthEnclosed from "./parenthEnclosed";
import reference from "./reference";

export default <sublexer>{
	isStartingToken: (tok: token) => {
		if (tok.type == tokenType.symbol && (tok.value == "!" || tok.value == "~")) return true;
		if (tok.type == tokenType.grapheme && (tok.value == "++" || tok.value == "--")) return true;
		if (parenthEnclosed.isStartingToken(tok)) return true;
		if (primitive.isStartingToken(tok)) return true;
		if (reference.isStartingToken(tok)) return true;
		return false;
	},
	lexer: (tok: token, tokenizer: parseMachine<token>) => {
		var retToken = new lexicon(lexiconType.singleton_value, tok, {
			prefix: <token | undefined>undefined,
			component: <lexicon | undefined>undefined,
			suffix: <token | undefined>undefined,
		});

		if (
			(tok.type == tokenType.symbol && (tok.value == "!" || tok.value == "~")) ||
			(tok.type == tokenType.grapheme && (tok.value == "++" || tok.value == "--"))
		) {
			retToken.children.prefix = tok;
			tok = tokenizer.next();
		}

		if (parenthEnclosed.isStartingToken(tok)) retToken.children.component = parenthEnclosed.lexer(tok, tokenizer);
		else if (primitive.isStartingToken(tok)) retToken.children.component = primitive.lexer(tok, tokenizer);
		else if (reference.isStartingToken(tok)) retToken.children.component = reference.lexer(tok, tokenizer);
		else return retToken;
		
		tok = tokenizer.next();
		if (tok.type == tokenType.grapheme && (tok.value == "++" || tok.value == "--")) {
			retToken.children.suffix = tok;
		} else {
			tokenizer.push(tok);
		}

		retToken.complete = true;
		return retToken;
	},
};
