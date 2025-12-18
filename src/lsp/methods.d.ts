export type registerMap = {
	initialize: InitializeParams;
	initialized: {};
};

export type ResourceOperationKind = "create" | "rename" | "delete";
export type FailureHandlingKind = "abort" | "transactional" | "undo";

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

export type MarkupKind = "markdown" | "plaintext";

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

export type CodeActionKind = "" | "quickfix" | "refactor" | "refactor.extract" | "refactor.inline" | "refactor.rewrite" | "source" | "source.fixAll";

export enum PrepareSupportDefaultBehaviour {
	Unknown,
	Identifier,
}

export enum DiagnosticTag {
	Unkown,
	Unnecessary,
	Deprecated,
}

export type FoldingRangeKind = "comment" | "imports" | "region";

export type TokenFormat = "relative";

export type ClientCapabilities = {
	workspace?: {
		applyEdit?: boolean;
		workspaceEdit?: {
			documentChanges?: boolean;
			resourceOperations?: ResourceOperationKind[];
			failureHandling?: FailureHandlingKind[];
			normalizeLineEndings?: boolean;
			changeAnnotationSnippet?: {
				groupsOnLabel?: boolean;
			};
		};
		didChangeConfiguration?: {
			dynamicRegistration?: boolean;
		};
		didChangeWatchedFiles?: {
			dynamicRegistration?: boolean;
			relativePatternSupport?: boolean;
		};
		symbol?: {
			dynamicRegistration?: boolean;
			symbolKind?: {
				valueSet?: SymbolKind[];
			};
			tagSupport?: {
				valueSet?: SymbolTag[];
			};
			resolveSupport?: {
				properties: string[];
			};
		};
		executeCommand?: {
			dynamicRegistration?: boolean;
		};
		workspaceFolders?: boolean;
		configuration?: boolean;
		semanticTokens?: {
			refreshSupport?: boolean;
		};
		codeLens?: {
			refreshSupport?: boolean;
		};
		fileOperations?: {
			dynamicRegistration?: boolean;
			didCreate?: boolean;
			willCreate?: boolean;
			didRename?: boolean;
			willRename?: boolean;
			didDelete?: boolean;
			willDelete?: boolean;
		};
		inlineValue?: {
			refreshSupport?: boolean;
		};
		inlayHint?: {
			refreshSupport?: boolean;
		};
		diagnostics?: {
			refreshSupport?: boolean;
		};
	};
	textDocument?: {
		synchronization?: {
			dynamicRegistration?: boolean;
			willSave?: boolean;
			willSaveWaitUntil?: boolean;
			didSave?: boolean;
		};
		completion?: {
			dynamicRegistration?: boolean;
			completionItem?: {
				snippetSupport?: boolean;
				commitCharactersSupport?: boolean;
				documentationFormat?: MarkupKind[];
				deprecatedSupport?: boolean;
				preselectSupport?: boolean;
				tagSupport?: {
					valueSet?: CompletionItemTag[];
				};
				insertReplaceSupport?: boolean;
				resolveSupport?: {
					properties?: string[];
				};
				insertTextModeSupport: {
					valueSet: InsertTextMode[];
				};
				labelDetailsSupport?: boolean;
			};
			completionItemKind?: {
				valueSet?: CompletionItemKind[];
			};
			contextSupport?: boolean;
			insertTextMode?: InsertTextMode;
			completionList?: {
				itemDefaults?: string[];
			};
		};
		hover?: {
			dynamicRegistration?: boolean;
			contentFormat: MarkupKind[];
		};
		signatureHelp?: {
			dynamicRegistration?: boolean;
			signatureInformation?: {
				documentationFormat?: MarkupKind[];
				parameterInformation?: {
					labelOffsetSupport?: boolean;
				};
				activeParameterSupport?: boolean;
			};
			contextSupport?: boolean;
		};
		declaration?: {
			dynamicRegistration?: boolean;
			linkSupport?: boolean;
		};
		definition?: {
			dynamicRegistration?: boolean;
			linkSupport?: boolean;
		};
		typeDefinition?: {
			dynamicRegistration?: boolean;
			linkSupport?: boolean;
		};
		implementation?: {
			dynamicRegistration?: boolean;
			linkSupport?: boolean;
		};
		reference?: {
			dynamicRegistration?: boolean;
		};
		documentHighlight?: {
			dynamicRegistration?: boolean;
		};
		documentSymbol?: {
			dynamicRegistration?: boolean;
			symbolKind?: {
				valueSet?: SymbolKind[];
			};
			hierarchicalDocumentSymbolSupport?: boolean;
			tagSupport?: {
				valueSet?: SymbolTag[];
			};
			labelSupport?: boolean;
		};
		codeAction?: {
			dynamicRegistration?: boolean;
			codeActionLiteralSupport?: {
				codeActionKind?: {
					valueSet?: CodeActionKind[];
				};
			};
			isPreferredSupport?: boolean;
			disabledSupport?: boolean;
			dataSupport?: boolean;
			resolveSupport?: {
				properties?: string[];
			};
			honorsChangeAnnotations?: boolean;
		};
		codeLens?: {
			dynamicRegistration?: boolean;
		};
		documentLink?: {
			dynamicRegistration?: boolean;
			tooltipSupport?: boolean;
		};
		colorProvider?: {
			dynamicRegistration?: boolean;
		};
		formatting?: {
			dynamicRegistration?: boolean;
		};
		rangeFormatting?: {
			dynamicRegistration?: boolean;
		};
		onTypeFormatting?: {
			dynamicRegistration?: boolean;
		};
		rename?: {
			dynamicRegistration?: boolean;
			prepareSupport?: boolean;
			prepareSupportDefaultBehavior?: PrepareSupportDefaultBehaviour;
			honorsChangeAnnotations?: boolean;
		};
		publishDiagnostics?: {
			relatedInformation?: boolean;
			tagSupport?: {
				valueSet?: DiagnosticTag[];
			};
			versionSupport?: boolean;
			codeDescriptionSupport?: boolean;
			dataSupport?: boolean;
		};
		foldingRange?: {
			dynamicRegistration?: boolean;
			rangeLimit?: number;
			lineFoldingOnly?: boolean;
			foldingRangeKind?: {
				valueSet?: FoldingRangeKind[];
			};
			foldingRange?: {
				collapsedText?: boolean;
			};
		};
		selectionRange?: {
			dynamicRegistration?: boolean;
		};
		linkingEditRange?: {
			dynamicRegistration?: boolean;
		};
		callHierarchy?: {
			dynamicRegistration?: boolean;
		};
		semanticTokens?: {
			dynamicRegistration?: boolean;
			requests?: {
				range?: boolean | {};
				full?:
					| boolean
					| {
							delta?: boolean;
					  };
			};
			tokenTypes?: string[];
			tokenModifiers?: string[];
			formats?: TokenFormat[];
			overlappingTokenSupport?: boolean;
			multilineTokenSupport?: boolean;
			serverCancelSupport?: boolean;
			augmentsSyntaxTokens?: boolean;
		};
		moniker?: {
			dynamicRegistration?: boolean;
		};
		typeHierarchy?: {
			dynamicRegistration?: boolean;
		};
		inlayValue?: {
			refreshSupport?: boolean;
		};
		inlayHint?: {
			dynamicRegistration?: boolean;
			resolveSupport?: {
				properties?: string[];
			};
		};
		diagnostic: {
			dynamicRegistration?: boolean;
			relatedDocumentSupport?: boolean;
			relatedInformation?: boolean;
			tagSupport?: {}; // UNKNOWN
			codeDescriptionSupport?: boolean;
			dataSupport?: boolean;
		};
	};
	textDocument?: {
		synchronization?: {
			dynamicRegistration?: boolean;
			// spec/#textDocumentSyncCapabilities
		};
		// spec/#textDocumentClientCapabilities
	};
	// spec/#clientCapabilities
	window: {
		workDoneProgress?: boolean;
		showMessage: {};
	};
	general: {
		positionEncodings: "utf-16"[];
	};
	experimental: {
		serverStatusNotification?: boolean;
		localDocs?: boolean;
	};
};

export type TraceValue = "off" | "messages" | "verbose";

export type InitializeMessage = {
	processId: number | null;
	locale?: string;
	rootPath?: string | null;
	rootUri: string | null;
	initializationOptions?: any;
	capabilities?: ClientCapabilities;
	trace?: TraceValue;
	workspaceFolders?: {
		uri: string;
		name?: string;
	}[];
	clientInfo: {
		name: string;
		version?: string;
	};
};
