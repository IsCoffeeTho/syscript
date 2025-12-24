import type { Problem } from "../errors/problem";
import { searchTree, type AbstractSyntaxTree } from "./treeSearch";

export function aggregateProblems(tree: AbstractSyntaxTree) {
	var retval: Problem[] = [];
	searchTree(tree, (leaf) => {
		if (!leaf)
			return;
		if (leaf.problem) retval.push(leaf.problem);
	});
	return retval;
}
