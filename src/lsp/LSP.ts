import { EventEmitter } from "events";
import RPC, { RpcError, type RPCError, type RPCMessage, type RPCRequest, type RPCResponse } from "./RPC";
import type { InitializeMessage, InitializeResponse } from "./types/lsp/messages/Initialize";
import type Workspace from "./types/workspace";
import type { ServerCapabilities } from "./types/lsp/capabilities";
import { error } from "console";

export class LSPResponse<R extends any = {}> {
	public readonly id;
	public result: R = <R>{};
	constructor(public readonly request: RPCRequest) {
		this.id = request.id;
	}
	
	send() {
		process.stdout.write(RPC.encode({
			id: this.id,
			result: this.result
		}));
	}
	
	throw(err: any) {
		if (!(err instanceof RpcError)) err = new RpcError(-32603, "Internal Server Error");
		process.stdout.write(RPC.encode({
			id: this.id,
			error: err.toJSON()
		}))
	}
}

export type LSPOption = {
	name: string;
	version?: string;
};

export default function LSP(opt: LSPOption) {
	var providers: { [_: string]: ((..._: any) => any) | null } = {
		declarationProvider: null,
		definitionProvider: null,
	};
	var workspaces: { [_: string]: Workspace } = {};

	var requestQueue: { [_: Exclude<RPCMessage["id"], null | undefined>]: RPCRequest } = {};
	var responseQueue: { [_: Exclude<RPCMessage["id"], null | undefined>]: RPCResponse | RPCError } = {};
	var errorQueue: RPCError[] = [];
	
	async function request(msg: RPCRequest) {
		msg.id = ".".repeat(32).replace(/./g, v => Math.floor(Math.random()*16).toString(16));
		requestQueue[msg.id] = msg;
		sendPacket(msg);
		await Promise.any([
			new Promise(async (res, rej) => {
				while (!responseQueue[<string | number>msg.id])
					await Bun.sleep(0);
				res(undefined);
			}),
			new Promise(async (res, rej) => {
				await Bun.sleep(1000 * 30);
				sendPacket({
					id: msg.id,
					error: new RpcError(-32803, "Message Timeout.").toJSON()
				})
				rej();
			})
		])
		let response = responseQueue[msg.id];
		if ((<RPCError>response).error)
			throw (<RPCError>response).error;
		return (<RPCResponse>response).result;
	}

	function sendPacket(msg: RPCMessage) {
		process.stdout.write(RPC.encode(msg));
	}

	function sendLog(level: number, args: any[]) {
		let message = args
			.map(v => {
				switch (typeof v) {
					case "object":
						if (v == null) return `null`;
						return JSON.stringify(v, null, "  ");
					default:
						return `${v}`;
				}
			})
			.join(" ");
		sendPacket({
			method: "window/logMessage",
			params: {
				type: level,
				message,
			},
		});
	}

	sendLog(5, [`Started LSP`]);
	return {
		logger: {
			assert(condition: boolean, ...msg: any[]) {
				if (condition !== false) return;
				this.error(`Assertion Failed:`, ...msg);
			},
			error: (...msg: any[]) => sendLog(1, msg),
			warn: (...msg: any[]) => sendLog(2, msg),
			info: (...msg: any[]) => sendLog(3, msg),
			log: (...msg: any[]) => sendLog(4, msg),
			debug: (...msg: any[]) => sendLog(5, msg),
		},
		onError(errHandler: (err: RPCError) => any) {
			(async () => {
				while (true) {
					while (errorQueue.length == 0)
						await Bun.sleep(0);
					errHandler(<RPCError>errorQueue.shift());
				}
			})();
		},
		goToDeclaration(provider: () => any) {
			providers.declarationProvider = provider;
		},
		begin() {
			let capabilities: ServerCapabilities = {};
			enum LSPState {
				uninitialized,
				initialized,
				ready,
			}
			let state = LSPState.uninitialized;
			process.stdin.on("data", (buf: Buffer) => {
				let messages = RPC.decode(buf);
				for (let message of messages) {
					try {
						if ((<RPCRequest>message).params) {
							let msg = <RPCRequest>message;
							if (state == LSPState.uninitialized) {
								if (msg.method != "initialize")
									throw new RpcError(-32002, "Server Not Initialized.");
								state = LSPState.initialized;
								let response = new LSPResponse<InitializeResponse>(msg);
								response.result = {
									capabilities: {},
									serverInfo: {
										name: opt.name,
										// @ts-ignore
										verison: opt.version
									}
								};
							} else if (state == LSPState.initialized) {
								if (msg.method != "initialized")
									throw new RpcError(-32002, "Server Not Initialized.");
								state = LSPState.ready;
								let response = new LSPResponse(msg);
								response.send();
							} else if (msg.method == "initialize" || msg.method == "initialized")
								throw new RpcError(-32803, "Request Failed. already initialized");
							
							if (msg.id) {
								switch (msg.method) {
									case "":
										return;
									default:
										throw new RpcError(-32601, "Notification Method not found.");
								}
							}
							
							let response = new LSPResponse(msg);
							
							switch (msg.method) {
								default:
									this.logger.debug(`Recieved method "${msg.method}".`);
									throw new RpcError(-32601, "Method not found.");
							}
							
						} else if ((<RPCError>message).error) {
							let msg = <RPCError>message;
							if (!msg.id || !requestQueue[msg.id])
								return errorQueue.push(msg);
							delete requestQueue[msg.id];
							responseQueue[msg.id] = msg;
						} else if ((<RPCResponse>message).result) {
							let msg = <RPCResponse>message;
							if (!msg.id)
								throw new RpcError(-32600, "Invalid Response");
							if (!requestQueue[msg.id])
								throw new RpcError(-32600, "Invalid Response");
							{
								delete requestQueue[msg.id];
								responseQueue[msg.id] = msg;
								return;
							}
						} else throw new RpcError(-32600, "Invalid Request.");
					} catch (err: any) {
						this.logger.error(err);
						if (!(err instanceof RpcError)) err = new RpcError(-32603, "Internal Server Error");
						sendPacket({
							id: message.id,
							error: err.toJSON()
						});
					}
				}
			});
		},
	};
}
