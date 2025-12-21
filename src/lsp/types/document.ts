import type Workspace from "./workspace";

export type DocumentUri = string;

export default class Document {
	constructor(public workspace: Workspace, public uri: DocumentUri) {
		
	}
}