import LSP from "./LSP";
import pkg from "../../package.json";
import type Document from "./types/document";

export default function sysclsp() {
	const lsp = LSP({
		name: "sysc-lsp",
		version: pkg.version
	});
	const logger = lsp.logger;
	
	lsp.goToDeclaration(() => {
		
	})
	
	lsp.begin();
} 