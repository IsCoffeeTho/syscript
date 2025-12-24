import { Problem, ProblemLevel } from "../errors/problem";
import { token } from "../tokens/tokenize";
import { lexicon, lexiconType } from "../tokens/lexer";
import { searchTree, type AbstractSyntaxTree } from "./treeSearch";

import locale from "../locale.json";

export function markOrphans(tree: AbstractSyntaxTree, filename: string) {
	var retval: Problem[] = [];
	searchTree(tree, (leaf, branch, childKey) => {
		if (branch == tree) {
			if (!(leaf instanceof token)) return;
		} else if (branch instanceof lexicon) {
			switch (branch.type) {
				case lexiconType.code_block:
					if (childKey == "statements")
						break;
					return;
				default:
					return;
			}
		} else return;
		
		if (!(leaf instanceof token))
			return;
		
		if (leaf.problem) return;
		var reason = locale.unexpected_token;
		
		switch (leaf.value) {
			case "{":
			case "}":
			case "[":
			case "]":
			case "(":
			case ")":
				reason = locale.mismatch_bracket;
				break;
		}
		
		leaf.problem = new Problem(reason, {
			filename,
			line: leaf.line,
			col: leaf.col,
			level: ProblemLevel.Error,
		});
	});
	return retval;
}
