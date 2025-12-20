import Document from "./document";

export default class Workspace {
	documents: {[_:string]: Document} = {};
	constructor(path: string) {
		
	}
	
	addDocument(path: string) {
		let doc = new Document(this, path);
		this.documents[path] = doc;
		return doc;
	}
}