import wrapParseMachine, { type parseMachine } from "./parseMachine";
import { tokenType, type token } from "./tokenize";

const graphemes = ["...", "#!", "//", "/*", "*/", "[]", "++", "--", "+=", "-=", "==", "!=", ">=", "<=", "<<", ">>", "/=", "*=", "&&", "||"];

export default function graphemizer(tokenizer: parseMachine<token>): parseMachine<token> {
	var tokenBuffer: token[] = [];
	var graphemeBuffer = "";
	return wrapParseMachine({
		consume() {
			if (tokenBuffer.length > 0) return <token>tokenBuffer.shift();
			while (tokenizer.hasNext()) {
				var tok = tokenizer.next();
				tokenBuffer.push(tok);
				if (tok.type != tokenType.symbol) {
					graphemeBuffer = "";
					break;
				}
				graphemeBuffer += tok.value;
				var noMatch = true;
				for (var grapheme of graphemes) {
					if (!grapheme.startsWith(graphemeBuffer)) {
						continue;
					}
					noMatch = false;
					if (grapheme == graphemeBuffer) {
						var tok = <token>tokenBuffer.shift();
						tok.type = tokenType.grapheme;
						tok.value = graphemeBuffer;
						tokenBuffer = [];
						graphemeBuffer = "";
						return tok;
					}
				}
				if (noMatch) {
					graphemeBuffer = "";
					break;
				}
			}
			return <token>tokenBuffer.shift();
		},
		available() {
			return tokenBuffer.length > 0 || tokenizer.hasNext();
		},
	});
}
