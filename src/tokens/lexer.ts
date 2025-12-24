import { tokenType, type token } from "./tokenize";
import { Problem } from "../errors/problem";
import type { parseMachine } from "./parseMachine";

export enum lexiconType {
	unknown,
	boolean_literal,
	string_literal,
	character_literal,
	number_literal,
	float_literal,
	array_literal,
	struct_literal,
	property,
	primitive,
	reference,
	subreference,
	accessor,
	singleton_value,
	value,
	logic_operator,
	comparative_operator,
	arithmetic_operator,
	assignment_operator,
	parenthesis_enclosed,
	ternary,
	declaration,
	if_statement,
	switch_statement,
	for_loop,
	while_loop,
	control_flow,
	return_statement,
	struct_def,
	field,
	class_def,
	function,
	method,
	type_sig,
	type_cast,
	code_block,
	call,
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

export class lexicon<C = any> {
	children: C;
	complete: boolean = false;
	problem?: Problem;
	col: number;
	line: number;
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
				for (var subchild of child) childStr += `\n${subchild}`.replace(/\n/g, "\n    ");
				if (child.length > 0) childStr += `\n`;
				childStr += `]`;
			} else {
				childStr += `${child}`;
			}
			header += childStr.replace(/\n/g, "\n│   ");
		}
	}
	header += `\n└ < ${this.complete ? "Complete" : "Incomplete !!! -----------------------------------------------------------"}`;
	return header;
};

export type sublexer = {
	isStartingToken: (tok: token | undefined) => boolean;
	lexer: (startToken: token, tokenizer: parseMachine<token>) => lexicon<any>;
};

import functions from "./sublex/functions/functions";
import structs from "./sublex/structures/structs";
import classes from "./sublex/structures/classes";
import shebang from "./sublex/comments/shebang";
import comments from "./sublex/comments/comments";
import wrapParseMachine from "./parseMachine";
import declaration from "./sublex/statements/declaration";

const documentLevelLexers: sublexer[] = [functions, structs, classes, comments, shebang, declaration];

export default function lexer(tokenizer: parseMachine<token>): parseMachine<lexicon | token> {
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
		available() {
			return tokenizer.hasNext();
		},
		context: tokenizer.context,
	});
}
