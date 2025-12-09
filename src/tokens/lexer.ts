import { tokenType, unknownToken, type token } from "./tokenize";
import type { parseMachine } from "./parseMachine";

export enum lexiconType {
	unknown,
	boolean_literal,
	string_literal,
	character_literal,
	integer_literal,
	float_literal,
	primitive,
	singleton_value,
	value,
	logic_operator,
	comparative_operator,
	arithmetic_operator,
	assignment_operator,
	parenthesis_enclosed,
	if_statement,
	function,
	code_block,
	type_sig,
	class_def,
	struct_def,
	parameter,
	variadic_parameter,
	param_list,
	comment,
	single_comment,
	multi_comment,
	import,
	export,
	document,
	shebang,
}

export class lexicon<C = (token | lexicon<any>)[]> {
	children: C;
	complete: boolean = false;
	col: number;
	line: number;
	size: number = 0;
	constructor(
		public type: lexiconType,
		startingToken: token | lexicon,
		children?: C,
	) {
		this.col = startingToken.col;
		this.line = startingToken.line;
		this.children = children ?? <any>{};
	}
}

const unknownLexicon = new lexicon(lexiconType.unknown, unknownToken, []);
export { unknownLexicon };

lexicon.prototype.toString = function () {
	var header = `Lexicon <${lexiconType[this.type]}> ${this.line}:${this.col}`;
	if (Array.isArray(this.children)) {
		for (var child of this.children) {
			header += `\n${child}`.replace(/\n/g, "\n│   ");
		}
	} else {
		for (var childKey in this.children) {
			var child = this.children[childKey];
			var childStr = `\n${childKey} = `;
			if (Array.isArray(child)) {
				childStr += `[`;
				for (var subchild of child)
					childStr += `\n${subchild}`.replace(/\n/g, "\n    ");
				if (child.length > 0)
					childStr += `\n`;
				childStr += `]`;
			} else {
				childStr += `${child}`;
			}
			header += childStr.replace(/\n/g, "\n│   ");
		}
	}
	header += this.complete ? "\n<complete>" : "\nINCOMPLETE !!!";
	return header;
};

export type sublexer = {
	isStartingToken: (tok: token) => boolean;
	lexer: (startToken: token, tokenizer: parseMachine<token>) => lexicon<any>;
};

import functions from "./sublex/functions/functions";
import structs from "./sublex/structs";
import classes from "./sublex/classes";
import shebang from "./sublex/comments/shebang";
import comments from "./sublex/comments/comments";
import wrapParseMachine from "./parseMachine";

const documentLevelLexers: sublexer[] = [functions, structs, classes, comments, shebang];

export default function lexer(filename: string, tokenizer: parseMachine<token>): parseMachine<lexicon | token> {
	return wrapParseMachine<lexicon | token>({
		consume() {
			while (tokenizer.hasNext()) {
				var tok = tokenizer.next();
				if (tok.type == tokenType.whitespace || tok.type == tokenType.newline) continue;
				for (var sublex of documentLevelLexers) {
					var lexStarted = sublex.isStartingToken(tok);
					if (!lexStarted) continue;
					return <lexicon>sublex.lexer(tok, tokenizer);
				}
				return tok;
			}
			return tokenizer.peek();
		},
		available: tokenizer.hasNext,
	});
}
