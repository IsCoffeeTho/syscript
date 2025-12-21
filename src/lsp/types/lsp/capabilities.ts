import type { CodeActionKind, CompletionItemKind, CompletionItemTag, FailureHandlingKind, FileOperationPatternKind, FoldingRangeKind, InsertTextMode, MarkupKind, PositionEncodingKind, ResourceOperationKind, SymbolKind, SymbolTag, TextDocumentSyncKind, TokenFormat, WorkDoneProgress } from "../general";

export type WorkspaceEditClientCapabilities = {
	documentChanges?: boolean;
	resourceOperations?: ResourceOperationKind[];
	failureHandling?: FailureHandlingKind;
	normalizesLineEndings?: boolean;
	changeAnnotationSupport?: {
		groupsOnLabel?: boolean;
	};
};

export type DidChangeConfigurationClientCapabilities = {
	dynamicRegistration?: boolean;
};

export type DidChangeWatchedFilesClientCapabilities = {
	dynamicRegistration?: boolean;
	relativePatternSupport?: boolean;
};

export type WorkspaceSymbolClientCapabilities = {
	dynamicRegistration?: boolean;
	symbolKind?: {
		valueSet?: SymbolKind[];
	};
	tagSupport?: {
		valueSet: SymbolTag[];
	};
	resolveSupport?: {
		properties: string[];
	};
};

export type ExecuteCommandClientCapabilities = {
	dynamicRegistration?: boolean;
};

export type SemanticTokensWorkspaceClientCapabilities = {
	refreshSupport?: boolean;
};

export type CodeLensWorkspaceClientCapabilities = {
	refreshSupport?: boolean;
};

export type InlineValueWorkspaceClientCapabilities = {
	refreshSupport?: boolean;
};

export type InlayHintWorkspaceClientCapabilities = {
	refreshSupport?: boolean;
};

export type DiagnosticWorkspaceClientCapabilities = {
	refreshSupport?: boolean;
};

export type TextDocumentSyncClientCapabilities = {
	dynamicRegistration?: boolean;
	willSave?: boolean;
	willSaveWaitUntil?: boolean;
	didSave?: boolean;
};

export type CompletionClientCapabilities = {
	dynamicRegistration?: boolean;
	completionItem?: {
		snippetSupport?: boolean;
		commitCharactersSupport?: boolean;
		documentationFormat?: MarkupKind[];
		deprecatedSupport?: boolean;
		preselectSupport?: boolean;
		tagSupport?: {
			valueSet: CompletionItemTag[];
		};
		insertReplaceSupport?: boolean;
		resolveSupport?: {
			properties: string[];
		};
		insertTextModeSupport?: {
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

export type HoverClientCapabilities = {
	dynamicRegistration?: boolean;
	contentFormat?: MarkupKind[];
};

export type SignatureHelpClientCapabilities = {
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

export type DeclarationClientCapabilities = {
	dynamicRegistration?: boolean;
	linkSupport?: boolean;
};

export type DefinitionClientCapabilities = {
	dynamicRegistration?: boolean;
	linkSupport?: boolean;
};

export type TypeDefinitionClientCapabilities = {
	dynamicRegistration?: boolean;
	linkSupport?: boolean;
};

export type ImplementationClientCapabilities = {
	dynamicRegistration?: boolean;
	linkSupport?: boolean;
};

export type ReferenceClientCapabilities = {
	dynamicRegistration?: boolean;
};

export type DocumentHighlightClientCapabilities = {
	dynamicRegistration?: boolean;
};

export type DocumentSymbolClientCapabilities = {
	dynamicRegistration?: boolean;
	symbolKind?: {
		valueSet?: SymbolKind[];
	};
	hierarchicalDocumentSymbolSupport?: boolean;
	tagSupport?: {
		valueSet: SymbolTag[];
	};
	labelSupport?: boolean;
};

export type CodeActionClientCapabilities = {
	dynamicRegistration?: boolean;
	codeActionLiteralSupport?: {
		codeActionKind: {
			valueSet: CodeActionKind[];
		};
	};
	isPreferredSupport?: boolean;
	disabledSupport?: boolean;
	dataSupport?: boolean;
	resolveSupport?: {
		properties: string[];
	};
	honorsChangeAnnotations?: boolean;
};

export type CodeLensClientCapabilities = {
	dynamicRegistration?: boolean;
};

export type DocumentLinkClientCapabilities = {
	dynamicRegistration?: boolean;
	tooltipSupport?: boolean;
};

export type DocumentColorClientCapabilities = {
	dynamicRegistration?: boolean;
};

export type DocumentFormattingClientCapabilities = {
	dynamicRegistration?: boolean;
};

export type DocumentRangeFormattingClientCapabilities = {
	dynamicRegistration?: boolean;
};

export type DocumentOnTypeFormattingClientCapabilities = {
	dynamicRegistration?: boolean;
};

export enum PrepareSupportDefaultBehavior {
	Unknown,
	Identifier,
}

export type RenameClientCapabilities = {
	dynamicRegistration?: boolean;
	prepareSupport?: boolean;
	prepareSupportDefaultBehavior?: PrepareSupportDefaultBehavior;
	honorsChangeAnnotations?: boolean;
};

export enum DiagnosticTag {
	Unknown,
	Unnecessary,
	Deprecated,
}

export type PublishDiagnosticsClientCapabilities = {
	relatedInformation?: boolean;
	tagSupport?: {
		valueSet: DiagnosticTag[];
	};
	codeDescriptionSupport?: boolean;
	dataSupport?: boolean;
};

export type FoldingRangeClientCapabilities = {
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

export type SelectionRangeClientCapabilities = {
	dynamicRegistration?: boolean;
};

export type LinkedEditingRangeClientCapabilities = {
	dynamicRegistration?: boolean;
};

export type CallHierarchyClientCapabilities = {
	dynamicRegistration?: boolean;
};

export type SemanticTokensClientCapabilities = {
	dynamicRegistration?: boolean;
	requests: {
		range?: boolean | {};
		full?:
			| boolean
			| {
					delta?: boolean;
			  };
	};
	tokenTypes: string[];
	tokenModifiers: string[];
	formats: TokenFormat[];
	overlappingTokenSupport?: boolean;
	multilineTokenSupport?: boolean;
	serverCancelSupport?: boolean;
	augmentsSyntaxTokens?: boolean;
};

export type MonikerClientCapabilities = {
	dynamicRegistration?: boolean;
};

export type TypeHierarchyClientCapabilities = {
	dynamicRegistration?: boolean;
};

export type InlineValueClientCapabilities = {
	dynamicRegistration?: boolean;
};

export type InlayHintClientCapabilities = {
	dynamicRegistration?: boolean;
	resolveSupport?: {
		properties: string[];
	};
};

export type ClientDiagnosticsTagOptions = number;

export type DiagnosticClientCapabilities = {
	dynamicRegistration?: boolean;
	relatedDocumentSupport?: boolean;
	relatedInformation?: boolean;
	tagSupport?: ClientDiagnosticsTagOptions;
	codeDescriptionSupport?: boolean;
	dataSupport?: boolean;
};

export type TextDocumentClientCapabilities = {
	synchronization?: TextDocumentSyncClientCapabilities;
	completion?: CompletionClientCapabilities;
	hover?: HoverClientCapabilities;
	signatureHelp?: SignatureHelpClientCapabilities;
	declaration?: DeclarationClientCapabilities;
	definition?: DefinitionClientCapabilities;
	typeDefinition?: TypeDefinitionClientCapabilities;
	implementation?: ImplementationClientCapabilities;
	references?: ReferenceClientCapabilities;
	documentHighlight?: DocumentHighlightClientCapabilities;
	documentSymbol?: DocumentSymbolClientCapabilities;
	codeAction?: CodeActionClientCapabilities;
	codeLens?: CodeLensClientCapabilities;
	documentLink?: DocumentLinkClientCapabilities;
	colorProvider?: DocumentColorClientCapabilities;
	formatting?: DocumentFormattingClientCapabilities;
	rangeFormatting?: DocumentRangeFormattingClientCapabilities;
	onTypeFormatting?: DocumentOnTypeFormattingClientCapabilities;
	rename?: RenameClientCapabilities;
	publishDiagnostics?: PublishDiagnosticsClientCapabilities;
	foldingRange?: FoldingRangeClientCapabilities;
	selectionRange?: SelectionRangeClientCapabilities;
	linkedEditingRange?: LinkedEditingRangeClientCapabilities;
	callHierarchy?: CallHierarchyClientCapabilities;
	semanticTokens?: SemanticTokensClientCapabilities;
	moniker?: MonikerClientCapabilities;
	typeHierarchy?: TypeHierarchyClientCapabilities;
	inlineValue?: InlineValueClientCapabilities;
	inlayHint?: InlayHintClientCapabilities;
	diagnostic?: DiagnosticClientCapabilities;
};

export type NotebookDocumentSyncClientCapabilities = {
	dynamicRegistration?: boolean;
	executionSummarySupport?: boolean;
};

export type NotebookDocumentClientCapabilities = {
	synchronization: NotebookDocumentSyncClientCapabilities;
};

export type ShowMessageRequestClientCapabilities = {
	messageActionItem?: {
		additionalPropertiesSupport?: boolean;
	};
};

export type ShowDocumentClientCapabilities = {
	support: boolean;
};

export type RegularExpressionsClientCapabilities = {
	engine: string;
	version?: string;
};

export type MarkdownClientCapabilities = {
	parser: string;
	version?: string;
	allowedTags?: string[];
};

export type ClientCapabilities = {
	workspace?: {
		applyEdit?: boolean;
		workspaceEdit?: WorkspaceEditClientCapabilities;
		didChangeConfiguration?: DidChangeConfigurationClientCapabilities;
		didChangeWatchedFiles?: DidChangeWatchedFilesClientCapabilities;
		symbol?: WorkspaceSymbolClientCapabilities;
		executeCommand?: ExecuteCommandClientCapabilities;
		workspaceFolders?: boolean;
		configuration?: boolean;
		semanticTokens?: SemanticTokensWorkspaceClientCapabilities;
		codeLens?: CodeLensWorkspaceClientCapabilities;
		fileOperations?: {
			dynamicRegistration?: boolean;
			didCreate?: boolean;
			willCreate?: boolean;
			didRename?: boolean;
			willRename?: boolean;
			didDelete?: boolean;
			willDelete?: boolean;
		};
		inlineValue?: InlineValueWorkspaceClientCapabilities;
		inlayHint?: InlayHintWorkspaceClientCapabilities;
		diagnostics?: DiagnosticWorkspaceClientCapabilities;
	};
	textDocument?: TextDocumentClientCapabilities;
	notebookDocument?: NotebookDocumentClientCapabilities;
	window?: {
		workDoneProgress?: boolean;
		showMessage?: ShowMessageRequestClientCapabilities;
		showDocument?: ShowDocumentClientCapabilities;
	};
	general?: {
		staleRequestSupport?: {
			cancel: boolean;
			retryOnContentModified: string[];
		};
		regularExpressions?: RegularExpressionsClientCapabilities;
		markdown?: MarkdownClientCapabilities;
		positionEncodings?: PositionEncodingKind[];
	};
	experimental?: any;
};

export type TextDocumentSyncOptions = {
	openClose?: boolean;
	change?: TextDocumentSyncKind;
};

export type NotebookDocumentFilter =
	| {
			notebookType: string;
			scheme?: string;
			pattern?: string;
	  }
	| {
			notebookType?: string;
			scheme: string;
			pattern?: string;
	  }
	| {
			notebookType?: string;
			scheme?: string;
			pattern: string;
	  };

export type NotebookDocumentSyncOptions = {
	notebookSelector:
		| {
				notebook: string | NotebookDocumentFilter;
				cells?: { language: string }[];
		  }
		| {
				notebook?: string | NotebookDocumentFilter;
				cells: { language: string }[];
		  };
	save?: boolean;
};

export type StaticRegistrationOptions = {
	id?: string;
};

export type NotebookDocumentSyncRegistrationOptions = NotebookDocumentSyncOptions & StaticRegistrationOptions;

export type CompletionOptions = WorkDoneProgress & {
	triggerCharacters?: string[];
	allCommitCharacters?: string[];
	resolveProvider?: boolean;
	completionItem?: {
		labelDetailsSupport?: boolean;
	};
};

export type HoverOptions = WorkDoneProgress;

export type SignatureHelpOptions = WorkDoneProgress & {
	triggerCharacters?: string[];
	retriggerCharacters?: string[];
};

export type DocumentFilter = {
	language?: string;
	scheme?: string;
	pattern?: string;
};

export type DocumentSelector = DocumentFilter[];

export type TextDocumentRegistrationOptions = {
	documentSelector: DocumentSelector | null;
};

export type DeclarationOptions = WorkDoneProgress;
export type DeclarationRegistrationOptions = DeclarationOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type DefinitionOptions = WorkDoneProgress;

export type TypeDefinitionOptions = WorkDoneProgress;
export type TypeDefinitionRegistrationOptions = TypeDefinitionOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type ImplementationOptions = WorkDoneProgress;
export type ImplementationRegistrationOptions = ImplementationOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type ReferenceOptions = WorkDoneProgress;

export type DocumentHighlightOptions = WorkDoneProgress;

export type DocumentSymbolOptions = WorkDoneProgress & {
	label?: string;
};

export type CodeActionOptions = WorkDoneProgress & {
	codeActionKinds?: CodeActionKind[];
	resolveProvider?: boolean;
};

export type CodeLensOptions = WorkDoneProgress & {
	resolveProvider?: boolean;
};

export type DocumentLinkOptions = WorkDoneProgress & {
	resolveProvider?: boolean;
};

export type DocumentColorOptions = WorkDoneProgress;
export type DocumentColorRegistrationOptions = DocumentColorOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type DocumentFormattingOptions = WorkDoneProgress;

export type DocumentRangeFormattingOptions = WorkDoneProgress;

export type DocumentOnTypeFormattingOptions = {
	firstTriggerCharacter: string;
	moreTriggerCharacter?: string[];
};
export type DocumentOnTypeRegistrationOptions = DocumentOnTypeFormattingOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type RenameOptions = WorkDoneProgress & {
	prepareProvider?: boolean;
};

export type FoldingRangeOptions = WorkDoneProgress;
export type FoldingRangeRegistrationOptions = FoldingRangeOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type ExecuteCommandOptions = WorkDoneProgress & {
	commands: string[];
};

export type SelectionRangeOptions = WorkDoneProgress;
export type SelectionRangeRegistrationOptions = SelectionRangeOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type LinkedEditingRangeOptions = WorkDoneProgress;
export type LinkedEditingRangeRegistrationOptions = LinkedEditingRangeOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type CallHierarchyOptions = WorkDoneProgress;
export type CallHierarchyRegistrationOptions = CallHierarchyOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type SemanticTokensLegend = {
	tokenTypes: string[];
	tokenModifiers: string[];
};

export type SemanticTokensOptions = WorkDoneProgress & {
	legend: SemanticTokensLegend;
	range?: boolean | {};
	full?:
		| boolean
		| {
				delta?: boolean;
		  };
};
export type SemanticTokensRegistrationOptions = SemanticTokensOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type MonikerOptions = WorkDoneProgress;
export type MonikerRegistrationOptions = MonikerOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type TypeHierarchyOptions = WorkDoneProgress;
export type TypeHierarchyRegistrationOptions = TypeHierarchyOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type InlineValueOptions = WorkDoneProgress;
export type InlineValueRegistrationOptions = InlineValueOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type InlayHintOptions = WorkDoneProgress & {
	resolveProvider?: boolean;
};
export type InlayHintRegistrationOptions = InlayHintOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type DiagnosticOptions = WorkDoneProgress & {
	identifer?: string;
	interFileDependencies: boolean;
	workspaceDiagnostics: boolean;
};
export type DiagnosticRegistrationOptions = DiagnosticOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;

export type WorkspaceSymbolOptions = WorkDoneProgress & {
	resolveProvider?: boolean;
};

export type WorkspaceFoldersServerCapabilities = {
	supported?: boolean;
	changeNotifications?: string | boolean;
};


export type FileOperationPatternOptions = {
	ignoreCase?: boolean;
};

export type FileOperationPattern = {
	glob: string;
	matches?: FileOperationPatternKind;
	options?: FileOperationPatternOptions;
};

export type FileOperationFilter = {
	scheme?: string;
	pattern: FileOperationPattern;
};

export type FileOperationRegistrationOptions = {
	filters: FileOperationFilter[];
};

export type ServerCapabilities = {
	positionEncoding?: PositionEncodingKind;
	textDocumentSync?: TextDocumentSyncOptions | TextDocumentSyncKind;
	notebookDocumentSync?: NotebookDocumentSyncOptions | NotebookDocumentSyncRegistrationOptions;
	completionProvider?: CompletionOptions;
	hoverProvider?: boolean | HoverOptions;
	signatureHelpProvider?: SignatureHelpOptions;
	declarationProvider?: boolean | DeclarationOptions | DeclarationRegistrationOptions;
	definitionProvider?: boolean | DefinitionOptions;
	typeDefinitionProvider?: boolean | TypeDefinitionOptions | TypeDefinitionRegistrationOptions;
	implementationProvider?: boolean | ImplementationOptions | ImplementationRegistrationOptions;
	referencesProvider?: boolean | ReferenceOptions;
	documentHighlightProvider?: boolean | DocumentHighlightOptions;
	documentSymbolProvider?: boolean | DocumentSymbolOptions;
	codeActionProvider?: boolean | CodeActionOptions;
	codeLensProvider?: CodeLensOptions;
	documentLinkProvider?: DocumentLinkOptions;
	colorProvider?: boolean | DocumentColorOptions | DocumentColorRegistrationOptions;
	documentFormattingProvider?: boolean | DocumentFormattingOptions;
	documentRangeFormattingProvider?: boolean | DocumentRangeFormattingOptions;
	documentOnTypeFormattingProvider?: DocumentOnTypeFormattingOptions;
	renameProvider?: boolean | RenameOptions;
	foldingRangeProvider?: boolean | FoldingRangeOptions | FoldingRangeRegistrationOptions;
	executeCommandProvider?: ExecuteCommandOptions;
	selectionRangeProvider?: boolean | SelectionRangeOptions | SelectionRangeRegistrationOptions;
	linkedEditingRangeProvider?: boolean | LinkedEditingRangeOptions | LinkedEditingRangeRegistrationOptions;
	callHierarchyProvider?: boolean | CallHierarchyOptions | CallHierarchyRegistrationOptions;
	semanticTokensProvider?: SemanticTokensOptions | SemanticTokensRegistrationOptions;
	monikerProvider?: boolean | MonikerOptions | MonikerRegistrationOptions;
	typeHierarchyProvider?: boolean | TypeHierarchyOptions | TypeHierarchyRegistrationOptions;
	inlineValueProvider?: boolean | InlineValueOptions | InlineValueRegistrationOptions;
	inlayHintProvider?: boolean | InlayHintOptions | InlayHintRegistrationOptions;
	diagnosticProvider?: DiagnosticOptions | DiagnosticRegistrationOptions;
	workspaceSymbolProvider?: boolean | WorkspaceSymbolOptions;
	workspace?: {
		workspaceFolders?: WorkspaceFoldersServerCapabilities;
		fileOperations?: {
			didCreate?: FileOperationRegistrationOptions;
			willCreate?: FileOperationRegistrationOptions;
			didRename?: FileOperationRegistrationOptions;
			willRename?: FileOperationRegistrationOptions;
			didDelete?: FileOperationRegistrationOptions;
			willDelete?: FileOperationRegistrationOptions;
		};
	};
	experimental?: any;
};
