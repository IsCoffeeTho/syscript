import wrapParseMachine, { type parseMachine } from "./parseMachine";
import { token, tokenType } from "./tokenize";

const graphemes = ["...", "#!", "//", "/*", "*/", "[]", "++", "--", "+=", "-=", "==", "!=", ">=", "<=", "<<", ">>", "<<=", "/=", "*=", "&&", "||"];

export default function graphemizer(tokenizer: parseMachine<token>): parseMachine<token> {
	var tokenBuffer: token[] = [];
	return wrapParseMachine({
		consume() {
			if (tokenBuffer.length > 0) return <token>tokenBuffer.shift();
			var lastMatch = "";
			var graphemeBuffer = "";
			while (tokenizer.hasNext()) {
				var tok = tokenizer.next();
				tokenBuffer.push(tok);
				if (tok.type != tokenType.symbol) {
					graphemeBuffer = "";
					break;
				}
				graphemeBuffer += tok.value;
				var noMatch = true;
				var singularMatch = true;
				for (var grapheme of graphemes) {
					if (!grapheme.startsWith(graphemeBuffer))
						continue;
					if (!noMatch)
						singularMatch = false;
					noMatch = false;
					if (grapheme == graphemeBuffer)
						lastMatch = grapheme;
				}
				if (noMatch) {
					if (lastMatch) {
						var tok = <token>tokenBuffer.shift();
						tok.type = tokenType.grapheme;
						tok.value = lastMatch;
						tokenBuffer = [<token>tokenBuffer.at(-1)];
						return tok;
					}
					break;
				} else if (singularMatch && graphemeBuffer == lastMatch) {
					var tok = <token>tokenBuffer.shift();
					tok.type = tokenType.grapheme;
					tok.value = graphemeBuffer;
					tokenBuffer = [];
					graphemeBuffer = "";
					return tok;
				}
			}
			return <token>tokenBuffer.shift();
		},
		available() {
			return tokenBuffer.length > 0 || tokenizer.hasNext();
		},
	});
}
