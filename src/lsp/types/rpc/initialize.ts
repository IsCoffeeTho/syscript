export type InitailizeMessage = {
	clientCapabilities: {},
};

export type InitializeResponse = {
	capabilities: {},
	serverInfo?: {
		name: string,
		version?: string
	}
};