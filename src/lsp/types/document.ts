import type Workspace from "./workspace";

export default class Document {
	constructor(public workspace: Workspace, public path: string) {
		
	}
}