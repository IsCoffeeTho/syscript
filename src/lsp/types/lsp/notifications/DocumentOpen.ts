import type { TextDocumentItem } from "../../general";

export type DocumentOpenNotification = {
	textDocument: TextDocumentItem;
};