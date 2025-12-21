export type ResourceOperationKind = "create" | "rename" | "delete";

export type FailureHandlingKind = "abort" | "transactional" | "undo" | "textOnlyTransactional";

export enum SymbolKind {
	Unknown,
	File,
	Module,
	Namespace,
	Package,
	Class,
	Method,
	Property,
	Field,
	Constructor,
	Enum,
	Interface,
	Function,
	Variable,
	Constant,
	String,
	Number,
	Boolean,
	Array,
	Object,
	Key,
	Null,
	EnumMember,
	Struct,
	Event,
	Operator,
	TypeParameter,
}

export enum SymbolTag {
	Unknown,
	Deprecated,
}

export type MarkupKind = "plaintext" | "markdown";

export enum CompletionItemTag {
	Unknown,
	Deprecated,
}

export enum InsertTextMode {
	Unknown,
	AsIs,
	AdjustIndentation,
}

export enum CompletionItemKind {
	Unknown,
	Text,
	Method,
	Function,
	Constructor,
	Field,
	Variable,
	Class,
	Interface,
	Module,
	Property,
	Unit,
	Value,
	Enum,
	Keyword,
	Snippet,
	Color,
	File,
	Reference,
	Folder,
	EnumMember,
	Constant,
	Struct,
	Event,
	Operator,
	TypeParameter,
}

export type CodeActionKind =
	| ""
	| "quickfix"
	| "refactor"
	| "refactor.extract"
	| "refactor.inline"
	| "refactor.rewrite"
	| "source"
	| "source.organizeImports"
	| "source.fixAll";

export type FoldingRangeKind = "comment" | "imports" | "region";

export type TokenFormat = "relative";

export type PositionEncodingKind = "utf-8" | "utf-16" | "utf-32";

export enum TextDocumentSyncKind {
	None,
	Full,
	Incremental,
}

export type FileOperationPatternKind = "file" | "folder";

export type ProgressToken = number | string;

export type ProgressParam<T> = {
	token: ProgressToken;
	value: T;
};

export type Position = {
	line: number;
	character: number;
};

export type Range = {
	start: Position;
	end: Position;
};

export type TextDocumentItem = {
	uri: string;
	languageId: string;
	version: number;
	text: string;
};

export type TextDocumentIdentifier = {
	uri: string;
};

export type TextDocumentPositionParams = {
	textDocument: TextDocumentIdentifier;
	position: Position;
};

export interface MarkupContent {
	kind: MarkupKind;
	value: string;
}

export type WorkDoneProgress = {
	workDoneToken?: ProgressToken;
};

export type TraceValue = "off" | "messages" | "verbose";

export type URI = string;
