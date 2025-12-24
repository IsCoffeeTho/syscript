import type { Problem } from "../errors/problem";
import { aggregateProblems } from "./AggregateProblems";
import { markOrphans } from "./markOrphans";
import type { AbstractSyntaxTree } from "./treeSearch";

export function semanticAnalysis(tree: AbstractSyntaxTree, filename: string) {
	var retval = {
		problemsList: <Problem[]>[]
	};
	markOrphans(tree, filename);
	
	
	
	retval.problemsList = aggregateProblems(tree);
	return retval;
}
