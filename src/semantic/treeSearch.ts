import { lexicon } from "../tokens/lexer";
import type { token } from "../tokens/tokenize";

export type DocumentUnit = lexicon | token;

export type AbstractSyntaxTree = DocumentUnit | DocumentUnit[];

export function searchTree(tree: AbstractSyntaxTree | undefined, fn: (leaf: DocumentUnit, branch: AbstractSyntaxTree | undefined, childKey: string | undefined) => any) {
	if (!tree) return;
	if (Array.isArray(tree)) {
		var i = 0;
		for (let leaf of tree) {
			if (leaf instanceof lexicon) searchTree(leaf, fn);
			fn(leaf, tree, `${i++}`);
		}
		return;
	} else if (tree instanceof lexicon) {
		for (let child in tree.children) {
			var leaf = tree.children[child];
			if (leaf instanceof lexicon) searchTree(leaf, fn);
			fn(leaf, tree, child);
		}
	}
}
