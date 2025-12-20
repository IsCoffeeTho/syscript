import { EventEmitter } from "events";
import RPC, { RpcError, type RPCError, type RPCMessage, type RPCRequest, type RPCResponse } from "./RPC";
import type { InitailizeMessage, InitializeResponse } from "./types/rpc/initialize";
import type Workspace from "./types/workspace";

export class LSPResponse<R extends any> {
	public readonly id;
	constructor(public readonly request: RPCRequest) {
		this.id = request.id;
	}
}

export type LSPOption = {
	name: string;
	version?: string;
};

export default function LSP(opt: LSPOption) {
	let providers: { [_: string]: ((..._: any) => any) | null } = {
		declarationProvider: null,
		definitionProvider: null,
	};
	let workspaces: { [_: string]: Workspace } = {};

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
		onGoToDeclaration(provider: () => any) {
			providers.declarationProvider = provider;
		},
		begin() {
			let capabilities = {};
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
							
						} else if ((<RPCError>message).error) {
							let msg = <RPCError>message;
							
						} else if ((<RPCResponse>message).result) {
							let msg = <RPCResponse>message;
							
						} else throw new RpcError(-32600, "Invalid Request.");
					} catch (err) {
						if (!(err instanceof RpcError)) err = new RpcError(-32603, "Internal Server Error");
						this.logger.error(err);
					}
				}
			});
		},
	};
}
