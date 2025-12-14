import wrapParseMachine, { type parseMachine } from "./parseMachine";
import { tokenType, type token } from "./tokenize";

const keywords = [
	"if",
	"else",
	"while",
	"for",
	"do",
	"continue",
	"break",
	"switch",
	"case",
	"true",
	"false",
	"let",
	"fn",
	"return",
	"const",
	"class",
	"struct",
	"typedef",
	"super",
	"extends",
	"import",
	"export",
	"implements",
];

export default function keywordizer(tokenizer: parseMachine<token>): parseMachine<token> {
	return wrapParseMachine({
		consume() {
			var tok = tokenizer.next();
			if (tok.type != tokenType.identifier) return tok;
			if (keywords.indexOf(tok.value) == -1) return tok;
			tok.type = tokenType.keyword;
			return tok;
		},
		available() {
			return tokenizer.hasNext();
		},
	});
}
