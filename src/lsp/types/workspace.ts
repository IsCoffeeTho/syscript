import Document from "./document";
import type { URI } from "./general";

export type WorkspaceFolder = {
	uri: URI;
	name: string;
};

export default class Workspace {
	documents: { [_: string]: Document } = {};
	constructor(path: string) {}

	addDocument(uri: string) {
		let doc = new Document(this, uri);
		this.documents[uri] = doc;
		return doc;
	}
}
