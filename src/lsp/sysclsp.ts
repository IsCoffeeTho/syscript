import LSP from "./LSP";
import pkg from "../../package.json";
import Document, { type ContentChange } from "./types/document";
import type { lexicon } from "../tokens/lexer";
import { token } from "../tokens/tokenize";
import { aggregateProblems } from "../semantic/AggregateProblems";
import { DiagnosticSeverity, type Diagnostic } from "./types/lsp/notifications/DocumentDiagnose";
import type { Range } from "./types/general";
import { Problem } from "../errors/problem";

import locale from "../locale.json";
import { markOrphans } from "../semantic/markOrphans";

export default function sysclsp() {
	const lsp = LSP({
		name: "sysc-lsp",
		version: pkg.version,
	});
	const logger = lsp.logger;

	var documents: { [_: string]: Document } = {};

	lsp.onDocOpen(async req => {
		let uri = req.textDocument.uri;
		var doc = documents[uri];
		if (!doc) {
			doc = new Document(lsp, uri);
			await doc.forceSync();
			documents[uri] = doc;
		}
	});

	lsp.onDocChange(async req => {
		let uri = req.textDocument.uri;
		var doc = documents[uri];
		if (!doc) return;
		doc.makeEdit(<ContentChange[]>req.contentChanges);
	});

	lsp.onDocDiagnose(async (req, res) => {
		let uri = req.textDocument.uri;
		let path = uri.slice(lsp.root_uri.length);
		var doc = documents[uri];
		if (!doc) {
			doc = new Document(lsp, uri);
			await doc.forceSync();
			documents[uri] = doc;
		}
		
		while (!doc.updated)
			await Bun.sleep(1);
			
		markOrphans(doc.ast, path);
		
		var problemsList = aggregateProblems(doc.ast);
		
		for (var leaf of doc.ast) {
			if (leaf instanceof token) {
				problemsList.push(new Problem(locale.unexpected_token, {
					filename: path,
					line: leaf.line,
					col: leaf.col,
					size: leaf.value.length,
				}));
			}
		}
		
		if (problemsList.length == 0) {
			res.result = {
				kind: "full",
				items: []
			};
			res.send();
			return;
		}
		res.result = {
			kind: "full",
			items: problemsList.map(v => {
				return {
					severity: DiagnosticSeverity.Error,
					message: v.description ?? "",
					range: <Range>{
						start: {
							line: (v.ctx?.line ?? 1) - 1,
							character: (v.ctx?.col ?? 1) - 1,
						},
						end: {
							line: (v.ctx?.line ?? 1) - 1,
							character: (v.ctx?.col ?? 1) + (v.ctx?.size ?? 0) - 1,
						},
					},
				};
			}),
		};
		res.send();
	});

	lsp.onHover(async (req, res) => {
		let uri = req.textDocument.uri;
		var doc = documents[uri];
		if (!doc) return;
		if (!doc.ast) return;
		var root: (lexicon | token)[] = doc.ast;

		res.result.contents = {
			kind: "markdown",
			value: "**test**",
		};
		res.send();
	});

	lsp.begin();
}
