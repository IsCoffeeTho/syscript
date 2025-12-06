import wrapParseMachine, { type parseMachine } from "./parseMachine";

export enum tokenType {
	EOF = -1,
	unknown,
	newline,
	whitespace,
	identifier,
	numeric,
	grapheme,
	symbol,
	keyword,
}

const tokenTypes = {
	[tokenType.newline]: /^(\r?\n)$/g,
	[tokenType.whitespace]: /^[^\S\n]+$/g,
	[tokenType.grapheme]: /^(#!|\/\/|\/\*|\*\/)$/g,
	[tokenType.identifier]: /^([a-zA-Z_][0-9a-zA-Z_]*)$/g,
	[tokenType.numeric]: /^([0-9][0-9_]*)$/g,
	[tokenType.symbol]: /^([\-\[\]\{\}\(\)\\\/\+\=!\@\#\$\%\^\&\*\`\~\"\'\:\;\,\.\<\>\?\|])$/g,
};

const keywords = ["if", "let", "new", "else", "class", "super", "struct", "import", "export", "implements"];

export type token = {
	value: string;
	type: tokenType;
	position: number;
	line: number;
	col: number;
};

export default function tokenize(file: Buffer): parseMachine<token> {
	var head = 0;
	var col = 1;
	var line = 1;

	var nextLine = false;

	var lastChar: string | undefined;

	var traverse = () => {
		if (lastChar) {
			var t = lastChar;
			lastChar = undefined;
			return t;
		}
		if (nextLine) {
			nextLine = false;
			col = 0;
			line++;
		}
		var char = file.readUInt8(head++);
		var unicode = 0;
		if ((char & 0xf8) == 0xf0) {
			char &= 0b111;
			unicode = 3;
		} else if ((char & 0xf0) == 0xe0) {
			char &= 0b1111;
			unicode = 2;
		} else if ((char & 0xe0) == 0xc0) {
			char &= 0b11111;
			unicode = 1;
		}
		for (; unicode > 0; unicode--) {
			char <<= 6;
			char |= file.readUInt8(head++);
		}
		col++;
		if (char == 0x0a) nextLine = true;
		return String.fromCodePoint(char);
	};

	var tok: token = {
		col,
		line,
		position: head,
		value: "",
		type: tokenType.unknown,
	};

	var yieldedToken = (c: string) => {
		var prevTok = tok;
		if (prevTok.type == tokenType.identifier && keywords.indexOf(prevTok.value) != -1) prevTok.type = tokenType.keyword;
		lastChar = c;
		tok = {
			col,
			line,
			value: "",
			position: head,
			type: tokenType.unknown,
		};
		return prevTok;
	};

	var consume = () => {
		while (head < file.length) {
			var c = traverse();
			var possible = tok.value + c;
			var failedMatch = true;
			for (var idx in tokenTypes) {
				var type = <keyof typeof tokenTypes>parseInt(idx);
				var tokenMatch = tokenTypes[type];
				if (possible.match(tokenMatch)) {
					tok.type = type;
					failedMatch = false;
				}
			}
			if (failedMatch)
				return yieldedToken(c);
			else
				tok.value += c;
		}
		if (tok.value != "") {
			return tok;
		}
		return {
			col,
			line,
			value: "",
			position: head + 1,
			type: tokenType.EOF,
		};
	};
	
	return wrapParseMachine({
		consume,
		available: () => (head < file.length)
	})
}
