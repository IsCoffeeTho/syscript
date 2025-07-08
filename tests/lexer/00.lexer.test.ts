import { expect, test } from "bun:test";
import { lexer } from "../../src/tokenize";

test("Pass in Nothing Error", () => {
	// @ts-expect-error
	expect(() => { lexer() }).toThrow();
})

test("Pass in String Error", () => {
	// @ts-expect-error
	expect(() => { lexer("") }).toThrow();
});

test("Pass in Number Array Error", () => {
	// @ts-expect-error
	expect(() => { lexer([10]) }).toThrow();
});

test("Empty Buffer", () => {
	var buf = Buffer.from("");
	var lexiconIterator = lexer(buf).next();
	expect(lexiconIterator.done).toBeTrue();
	expect(lexiconIterator.value).toBeUndefined();
});