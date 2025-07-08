export enum tokenPrimatives {
	EOF = -1,
	unknown,
	symbolic, // names of things
	numeric,
	whitespace,
	newline,

	// symbols
	exclamation,
	quotation,
	hash,
	dollar,
	percent,
	ampersand,
	apostrophe,
	left_paranethesis,
	right_paranethesis,
	asterisk,
	plus,
	comma,
	minus,
	period,
	slash,
	colon,
	semicolon,
	less_than,
	equals,
	greater_than,
	question,
	at_sign,
	left_bracket,
	back_slash,
	right_bracket,
	caret,
	underscore,
	backtick,
	left_brace,
	pipe,
	right_brace,
	tilde,

	// keywords
	return,
	import,
	export,
}

export type token = {
	value: string,
	type: tokenPrimatives,
	position: number,
	row: number,
	col: number
};

export default function tokenize(buf: Uint8Array) {

	var position = 0;

	var row = 1;
	var col = 1;

	var lastCharWasNewLine = false;

	function peek() {
		return String.fromCharCode(<number>buf.at(position));
	}

	function getNext() {
		position++;
		var c = peek();
		if (c == '\n') {
			col = 0;
			row++;
		}
		col++;
		return c;
	}

	return {
		next(): token {
			var tok: token = {
				type: tokenPrimatives.EOF,
				value: "",
				position,
				row,
				col,
			};

			if (!this.hasNext())
				return tok;

			tok.type = tokenPrimatives.unknown;

			var c = peek();

			tok.value = c;
			if (c == '\n') {
				tok.type = tokenPrimatives.newline;
				getNext();
				return tok;
			}

			if (c.match(/\s/g)) {
				tok.type = tokenPrimatives.whitespace;
				getNext();
				c = peek();
				while (c.match(/\s/g)) {
					tok.value += c;
					getNext();
					c = peek();
				}
				return tok;
			}

			if (c.match(/[a-zA-Z]/g)) {
				tok.type = tokenPrimatives.symbolic;
				getNext();
				c = peek();
				while (c.match(/[a-zA-Z]/g)) {
					tok.value += c;
					getNext();
					c = peek();
				}

				switch (tok.value) {
					case "return": tok.type = tokenPrimatives.return; break;
					case "import": tok.type = tokenPrimatives.import; break;
					case "export": tok.type = tokenPrimatives.export; break;
				}
				return tok;
			}

			if (c.match(/[0-9]/g)) {
				tok.type = tokenPrimatives.numeric;
				getNext();
				c = peek();
				while (c.match(/[0-9]/g)) {
					tok.value += c;
					getNext();
					c = peek();
				}
				return tok;
			}

			switch (tok.value) {
				case "!": tok.type = tokenPrimatives.exclamation; break;
				case "\"": tok.type = tokenPrimatives.quotation; break;
				case "#": tok.type = tokenPrimatives.hash; break;
				case "$": tok.type = tokenPrimatives.dollar; break;
				case "%": tok.type = tokenPrimatives.percent; break;
				case "&": tok.type = tokenPrimatives.ampersand; break;
				case "'": tok.type = tokenPrimatives.apostrophe; break;
				case "(": tok.type = tokenPrimatives.left_paranethesis; break;
				case ")": tok.type = tokenPrimatives.right_paranethesis; break;
				case "*": tok.type = tokenPrimatives.asterisk; break;
				case "+": tok.type = tokenPrimatives.plus; break;
				case ",": tok.type = tokenPrimatives.comma; break;
				case "-": tok.type = tokenPrimatives.minus; break;
				case ".": tok.type = tokenPrimatives.period; break;
				case "/": tok.type = tokenPrimatives.slash; break;
				case ":": tok.type = tokenPrimatives.colon; break;
				case "'": tok.type = tokenPrimatives.semicolon; break;
				case "<": tok.type = tokenPrimatives.less_than; break;
				case "=": tok.type = tokenPrimatives.equals; break;
				case ">": tok.type = tokenPrimatives.greater_than; break;
				case "?": tok.type = tokenPrimatives.question; break;
				case "@": tok.type = tokenPrimatives.at_sign; break;
				case "[": tok.type = tokenPrimatives.left_bracket; break;
				case "\\": tok.type = tokenPrimatives.back_slash; break;
				case "]": tok.type = tokenPrimatives.right_bracket; break;
				case "^": tok.type = tokenPrimatives.caret; break;
				case "_": tok.type = tokenPrimatives.underscore; break;
				case "`": tok.type = tokenPrimatives.backtick; break;
				case "{": tok.type = tokenPrimatives.left_brace; break;
				case "|": tok.type = tokenPrimatives.pipe; break;
				case "}": tok.type = tokenPrimatives.right_brace; break;
				case "~": tok.type = tokenPrimatives.tilde; break;
			}


			getNext();
			return tok;
		},
		hasNext() {
			return position < (buf.length - 1);
		}
	}
}