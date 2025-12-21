import type { DocumentUri } from "../../document";
import type { TraceValue, WorkDoneProgress } from "../../general";
import type { WorkspaceFolder } from "../../workspace";
import type { ClientCapabilities, ServerCapabilities } from "../capabilities";

export type InitializeMessage = WorkDoneProgress & {
	processId: number | null;
	clientInfo?: {
		name: string;
		version?: string;
	};
	locale?: string;
	rootPath?: string | null;
	rootUri?: DocumentUri | null;
	initializationOptions?: any;
	capabilities: ClientCapabilities;
	trace?: TraceValue;
	workspaceFolders?: WorkspaceFolder[] | null;
};

export type InitializeResponse = {
	capabilities: ServerCapabilities;
	serverInfo?: {
		name: string;
		version?: string;
	};
};
