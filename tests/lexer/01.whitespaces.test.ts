import { expect, test } from "bun:test";
import { lexer, type lexicon, lexiconType } from "../../src/tokenize";

var whitespaces: { [_: string]: string } = {
	"Horizontal Tab": '\t',
	"Vertical Tabulation": '\v',
	"Form Feed": '\f',
	"Carriage Return": '\r',
	"Space": " ",
	"Combination": "\t\v\f\r "
}

for (var whitespace in whitespaces) {
	test(whitespace, () => {
		var ws = <string>whitespaces[whitespace];
		var buf = Buffer.from(ws);
		var lexiconIterator = lexer(buf).next();
		expect(lexiconIterator.done).toBeFalse();
		expect(lexiconIterator.value).toBeObject();
		var lexicon = <lexicon>lexiconIterator.value;
		expect(lexicon.position).toBe(0);
		expect(lexicon.type).toBe(lexiconType.whitespace);
	});
}

test("Line Feed", () => {
	var buf = Buffer.from("\n");
	var lexiconIterator = lexer(buf).next();
	expect(lexiconIterator.done).toBeFalse();
	expect(lexiconIterator.value).toBeObject();
	var lexicon = <lexicon>lexiconIterator.value;
	expect(lexicon.position).toBe(0);
	expect(lexicon.type).toBe(lexiconType.newline);
});

test("Whitespace String", () => {
	var ws = "";
	for (var whitespace in whitespaces)
		ws += <string>whitespaces[whitespace];
	var buf = Buffer.from(ws);
	var lexiconIterator = lexer(buf).next();
	expect(lexiconIterator.done).toBeFalse();
	expect(lexiconIterator.value).toBeObject();
	var lexicon = <lexicon>lexiconIterator.value;
	expect(lexicon.position).toBe(0);
	expect(lexicon.type).toBe(lexiconType.whitespace);
	expect(Buffer.from(lexicon.value).toString()).toBe(ws);
});