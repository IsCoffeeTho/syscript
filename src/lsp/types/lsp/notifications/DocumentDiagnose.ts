import type { Range, TextDocumentIdentifier } from "../../general";
import type { DiagnosticTag } from "../capabilities";

export type DocumentDiagnoseNotif = {
	textDocument: TextDocumentIdentifier;
	identifier?: string;
	previousResultId?: string;
};

export type DocumentDiagnosticReportKind = "full" | "uchanged";

export enum DiagnosticSeverity {
	Unknown,
	Error,
	Warning,
	Information,
	Hint,
}

export type DiagnosticRelatedInformation = {
	/**
	 * The location of this related diagnostic information.
	 */
	location: {
		uri: string;
		range: Range;
	};

	/**
	 * The message of this related diagnostic information.
	 */
	message: string;
};

export type Diagnostic = {
	range: Range;
	severity?: DiagnosticSeverity;
	code?: number | string;
	codeDescription?: {
		href: string;
	};
	source?: string;
	message: string;
	tags?: DiagnosticTag[];
	relatedInformation?: DiagnosticRelatedInformation[];
	data?: any;
};

export type FullDocumentDiagnosticReport = {
	kind: "full";
	resultId?: string;
	items: Diagnostic[];
};

export type UnchangedDocumentDiagnosticReport = {
	kind: "unchanged";
	resultId: string;
};

export type RelatedFullDocumentDiagnosticReport = FullDocumentDiagnosticReport & {
	relatedDocuments?: {
		[uri: string]: FullDocumentDiagnosticReport | UnchangedDocumentDiagnosticReport;
	};
};

export type RelatedUnchangedDocumentDiagnosticReport = UnchangedDocumentDiagnosticReport & {
	relatedDocuments?: {
		[uri: string]: FullDocumentDiagnosticReport | UnchangedDocumentDiagnosticReport;
	};
};

export type DiagnosticReport = RelatedFullDocumentDiagnosticReport | RelatedUnchangedDocumentDiagnosticReport;
