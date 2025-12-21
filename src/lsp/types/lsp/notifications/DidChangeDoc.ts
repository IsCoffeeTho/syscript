import type { Range } from "../../general";

export type DidChangeDocumentNotif = {
	textDocument: {
		uri: string;
		version: string;
	};
	contentChanges: (
		| {
				range: Range;
				rangeLength?: number;
				text: string;
		  }
		| {
				text: string;
		  }
	)[];
};
