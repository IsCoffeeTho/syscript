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

const tokenTypeRegExp = {
	[tokenType.newline]: /^(\n)$/g,
	[tokenType.whitespace]: /^[^\S\n]+$/g,
	[tokenType.identifier]: /^([a-zA-Z_][0-9a-zA-Z_]*)$/g,
	[tokenType.numeric]: /^([0-9][0-9_]*)$/g,
	[tokenType.symbol]: /^([\-\[\]\{\}\(\)\\\/\+\=!\@\#\$\%\^\&\*\`\~\"\'\:\;\,\.\<\>\?\|])$/g,
};

const keywords = ["if", "else", "true", "false", "let", "fn", "return", "const", "class", "super", "extends", "struct", "import", "export", "implements"];

export class token {
	type: tokenType = tokenType.unknown;
	value: string = "";
	constructor(
		public position: number,
		public line: number,
		public col: number,
	) {}
}

token.prototype.toString = function () {
	return `Token ${JSON.stringify(this.value)} <${tokenType[this.type]}> ${this.line}:${this.col}`;
};

const unknownToken = new token(0, 0, 0);
export { unknownToken };

export default function tokenize(file: Buffer): parseMachine<token> {
	var head = 0;
	var col = 1;
	var line = 1;

	var nextLine = false;

	var lastChar: string | undefined;

	var eofToken = new token(-1, -1, -1);
	eofToken.type = tokenType.EOF;

	var nextCharacter = () => {
		try {
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
		} catch (err) {
			throw new Error(`Malformed UTF-8 unicode character @ (~${head}) ${line}:${col}`);
		}
	};

	var tok: token = new token(0, 1, 1);

	var consume = () => {
		while (head < file.length || lastChar) {
			var c = nextCharacter();
			var possible = tok.value + c;
			var failedMatch = true;
			for (var idx in tokenTypeRegExp) {
				var type = <keyof typeof tokenTypeRegExp>parseInt(idx);
				var tokenMatch = tokenTypeRegExp[type];
				if (possible.match(tokenMatch)) {
					tok.type = type;
					failedMatch = false;
				}
			}
			if (!failedMatch) {
				tok.value += c;
				continue;
			}
			var poppingToken = tok;
			if (poppingToken.type == tokenType.identifier && keywords.indexOf(poppingToken.value) != -1) poppingToken.type = tokenType.keyword;
			lastChar = c;
			tok = new token(head, line, col);
			return poppingToken;
		}
		if (tok.value != "") {
			var retToken = tok;

			tok = eofToken;
			eofToken.position = head;
			eofToken.line = line;
			eofToken.col = col;

			return retToken;
		}
		eofToken.position = head;
		eofToken.line = line;
		eofToken.col = col;
		return eofToken;
	};

	return wrapParseMachine({
		consume,
		available: () => head < file.length || lastChar != undefined,
	});
}
