export type RPCPacket = {
	id?: string | number | null;
};

export type RPCRequest = RPCPacket & {
	method: string;
	params: any;
};

export type RPCResponse = RPCPacket & {
	result: any;
};

export type RPCError = RPCPacket & {
	error: {
		code: number;
		message: string;
		data?: any;
	};
};

export type RPCMessage = RPCRequest | RPCResponse | RPCError;

export type RPCBody = RPCMessage & {
	jsonrpc: "2.0" | "1.0" | string;
};

export class RpcError {
	stack: string[];
	constructor(
		public readonly code: number,
		public readonly message: string,
		public readonly data?: any,
	) {
		const stack = <string>new Error().stack;
		this.stack = stack
			.split("\n")
			.slice(2)
			.map(v => v.replace(/^\s+at\s+/g, ""));
	}
}

RpcError.prototype.toString = function () {
	return `RPC Error [${this.code}]: ${this.message}\n${this.stack.map(v => `  at ${v}`).join("\n")}`;
};

// @ts-ignore
RpcError.prototype.toJSON = function () {
	let retval: any = {
		code: this.code,
		message: this.message,
	};
	if (this.data) retval.data = this.data;
	return retval;
};

export default {
	encode(msg: RPCMessage) {
		let body = JSON.stringify(msg);
		let headers = {
			"Content-Length": body.length,
			"Content-Type": "application/vscode-jsonrpc; charset=utf-8",
		};
		return `${Object.keys(headers)
			.map(v => `${v}: ${<string>headers[<keyof typeof headers>v]}`)
			.join("\r\n")}\r\n\r\n${body}`;
	},
	decode(buf: Buffer) {
		let dataBuffer = buf.toString();
		let messages: RPCMessage[] = [];
		while (dataBuffer.length > 0) {
			let [headerPart, ...dataBufferParts] = dataBuffer.split("\r\n\r\n");
			if (dataBufferParts.length <= 0) throw new RpcError(-32700, "Parse Error. Missing Content.");
			dataBuffer = dataBufferParts.join("\r\n\r\n");
			let headerLines = (<string>headerPart).split("\r\n");
			let headers: { [_: string]: string } = {};
			headerLines.forEach(line => {
				let sep = line.indexOf(": ");
				if (sep == -1) throw new RpcError(-32700, "Parse Error");
				let key = line.slice(0, sep);
				let value = line.slice(sep + 2);
				headers[key.trim()] = value.trim();
			});
			if (!headers["Content-Length"]) throw new RpcError(-32700, "Parse Error. Missing 'Content-Length' header.");
			const contentLength = parseInt(headers["Content-Length"]);
			if (contentLength <= 0) throw new RpcError(-32600, "'Content-Length' Header must be a positive integer greater than zero.");
			let body = dataBuffer.slice(0, contentLength);
			dataBuffer = dataBuffer.slice(contentLength);
			let data: Partial<RPCBody> = {};
			try {
				data = JSON.parse(body);
			} catch (err) {
				throw new RpcError(-32700, "Parse Error.");
			}
			if (data.jsonrpc != "2.0") throw new RpcError(-32600, "Invalid RPC version.");
			if ((<RPCRequest>data).method) {
				if (!(<RPCRequest>data).params) throw new RpcError(-32600, "Missing 'params' on request.");
			} else if ((<RPCError>data).error) {
			} else if ((<RPCResponse>data).result) {
				if (!(<RPCRequest>data).id) throw new RpcError(-32600, "Missing 'id' on response.");
			} else throw new RpcError(-32600, "Missing one of ['method', 'result', 'error'].");
			messages.push(<RPCMessage>{
				id: data.id,
				// @ts-ignore
				params: data.params,
				// @ts-ignore
				error: data.error,
				// @ts-ignore
				method: data.method,
				// @ts-ignore
				result: data.result,
			});
		}
		return messages;
	},
};
