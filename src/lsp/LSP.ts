import type { registerMap } from "./methods";

type LSPRequest = {
	id: string | number | null;
	params?: any;
	error?: {
		code: number;
		message: string;
		data: any;
	};
};

export class LSPResponse<P extends any> {
	public readonly id?: string | number | null;
	constructor(
		private parent: LSP,
		request: LSPRequest,
	) {
		this.id = request.id;
	}

	send(data: P) {
		this.parent.send({
			id: this.id,
			result: data,
		});
	}

	throw(code: number, message: string, data?: any) {
		this.parent.send({
			id: this.id,
			error: {
				code,
				message,
				data,
			},
		});
	}
}

export type LSPMethodHandler<P extends any, R extends any> = (params: P, res: LSPResponse<R>) => any;

export default class LSP {
	#route: { [method: string]: LSPMethodHandler<any, any> } = {};
	#requestQueue: { [id: string]: boolean } = {};
	#responseQueue: { [id: string]: LSPRequest } = {};
	#onerror: LSPMethodHandler<{ code: number; data: any }, any> = err => console.error;
	constructor() {}

	register<K extends keyof registerMap>(method: K, routine: LSPMethodHandler<registerMap[K][0], registerMap[K][1]>) {
		this.#route[method] = routine;
	}

	onError<T extends any>(routine: LSPMethodHandler<{ code: number; data: T }, {}>) {}

	async begin() {
		process.stdin.on("data", buf => {
			let dataBuf = buf.toString();
			while (dataBuf.length > 0) {
				try {
					let [headerPart, ...contentParts] = dataBuf.split("\r\n\r\n");
					let content = contentParts.join("\r\n\r\n");
					let headers: { [_: string]: string } = {};
					(<string>headerPart).split("\r\n").forEach((line, i, a) => {
						var sep = line.indexOf(": ");
						if (sep == -1) throw `Bad Header line ${i + 1}.`;
						var key = line.slice(0, sep);
						var value = line.slice(sep + 2).trim();
						headers[key] = value;
					});

					if (!headers["Content-Length"]) throw "Missing Content-Length header.";
					var contentLength = parseInt(headers["Content-Length"]);
					if (Number.isNaN(contentLength)) throw "Invalid Content-Length header.";
					if (content.length < contentLength) throw "Bad Length";
					dataBuf = content.slice(contentLength);
					content = content.slice(0, contentLength);
					var body = JSON.parse(content);

					if (body.jsonrpc != "2.0")
						this.send({
							error: {
								code: -32601,
								message: "Method not found",
							},
						});

					if (body.id == undefined) body.id = null;
					else if (this.#requestQueue[body.id] == true) {
						delete this.#requestQueue[body.id];
						this.#responseQueue[body.id] = body;
					}

					if (body.error != undefined) {
						body.method = "error";
						body.params = body.error;
					}

					if (body.method == undefined) throw "Missing method.";
					if (typeof body.method != "string") throw "Invalid method.";

					if (!this.#route[body.method]) {
						this.send({
							error: {
								code: -32601,
								message: "Method not found",
							},
						});
						return;
					}

					const res = new LSPResponse(this, body);
					try {
						(<LSPMethodHandler<any, any>>this.#route[body.method])(body.params, res);
					} catch (err: any) {
						console.error(err);
						this.send({
							error: {
								code: -32603,
								message: `Internal Error: ${err.message ?? err}`,
							},
						});
						return;
					}
				} catch (err: any) {
					console.log(err);
					this.send({
						error: {
							code: -32700,
							message: `Parsing Error: ${err}`,
						},
					});
				}
			}
		});
	}

	async request(method: string, params: any) {
		const idBucket = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const id = ".".repeat(32).replace(/./g, _ => <string>idBucket[Math.floor(Math.random() * idBucket.length)]);
		this.send({
			jsonrpc: "2.0",
			id,
			method,
			params,
		});
		this.#requestQueue[id] = true;
		while (!this.#responseQueue[id]) await Bun.sleep(0);
		return this.#responseQueue[id];
	}

	send(packet: any) {
		var body = JSON.stringify(packet);
		var headers = `Content-Length: ${body.length}\r\nContent-Type: application/vscode-jsonrpc; charset=utf-8\r\n`;
		process.stdout.write(`${headers}\r\n${body}`);
	}
}
