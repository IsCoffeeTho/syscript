import type { MarkupContent, Range, TextDocumentPositionParams, WorkDoneProgress } from "../../general";

export type HoverRequest = TextDocumentPositionParams & WorkDoneProgress;

export type HoverResponse = {
	contents: MarkupContent;
	range?: Range;
};