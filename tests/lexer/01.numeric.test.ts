import { expect, test } from "bun:test";
import { lexer, type lexicon, lexiconType } from "../../src/tokenize";

var nums: { [_: string]: string } = {
	"Valid Numerals": "0123456789",
	"Singular Digit": "1",
	"INT MAX": "9223372036854775807",
	"More than INT MAX": "9223372036854775809",
	"Weird Padding": "0000000000000000000000000001",
	"1024 Zeros": '0'.repeat(1024),
}

for (var num in nums) {
	test(num, () => {
		var sym = <string>nums[num];
		var buf = Buffer.from(sym);
		var lexiconIterator = lexer(buf).next();
		expect(lexiconIterator.done).toBeFalse();
		expect(lexiconIterator.value).toBeObject();
		var lexicon = <lexicon>lexiconIterator.value;
		expect(lexicon.position).toBe(0);
		expect(lexicon.type).toBe(lexiconType.numeric);
		expect(lexicon.value.length).toBe(sym.length);
	});
}