import { expect, test } from "bun:test";
import { lexer, type lexicon, lexiconType } from "../../src/tokenize";

var symbols: { [_: string]: string } = {
	"Quote": "'",
	"Double Quote": '"',
	"Semicolon": ";",
	"Colon": ":",
	"Left bracket": "[",
	"Right bracket": "]",
	"Left brace": "{",
	"Right brace": "}",
	"Left parenthesis": "(",
	"Right parenthesis": ")",
	"Less than": "<",
	"Greater than": ">",
	"Hyphen": "-",
	"Underscore": "_",
	"Plus": "+",
	"Equals": "=",
	"Pipe": "|",
	"Backslash": "\\",
	"Forward slash": "/",
	"Question mark": "?",
	"Comma": ",",
	"Period": ".",
	"Exclamation mark": "!",
	"At": "@",
	"Hash": "#",
	"Dollar": "$",
	"Percent": "%",
	"Caret": "^",
	"Ampersand": "&",
	"Asterisk": "*",
	"Backtick": "`",
	"Tilde": "~"
}

for (var symbol in symbols) {
	test(symbol, () => {
		var sym = <string>symbols[symbol];
		var buf = Buffer.from(sym);
		var lexiconIterator = lexer(buf).next();
		expect(lexiconIterator.done).toBeFalse();
		expect(lexiconIterator.value).toBeObject();
		var lexicon = <lexicon>lexiconIterator.value;
		expect(lexicon.position).toBe(0);
		expect(lexicon.type).toBe(lexiconType.punctuation);
	});
}