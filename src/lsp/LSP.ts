type LSPRequest = {
	id: string | number | null;
	params?: any;
	error?: {
		code: number;
		message: string;
		data: any;
	};
};

export class LSPResponse {
	public readonly id?: string | number | null;
	constructor(private parent: LSP, request: LSPRequest) {
		this.id = request.id;
	}
	
	send(data: any) {
		this.parent.send({
			id: this.id,
			params: data,
		});
	}
	
	throw(code: number, message: string, data?: any) {
		this.parent.send({
			id: this.id,
			error: {
				code,
				message,
				data,
			}
		});
	}
}

export type LSPMethodHandler<T extends any> = (params: T, res: LSPResponse) => any;

export default class LSP {
	#route: { [method: string]: LSPMethodHandler<any> } = {};
	constructor() {}

	register<T extends any>(method: string, routine: LSPMethodHandler<T>) {
		this.#route[method] = routine;
	}

	async begin() {
		process.stdin.on("data", buf => {
			try {
				let [headerPart, ...bodyParts] = buf.toString().split("\r\n\r\n");
				let body = bodyParts.join("\r\n\r\n");
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
				if (body.length < contentLength) throw "Bad Length";
				if (body.length > contentLength) body = body.slice(contentLength);
				var packet = JSON.parse(body);
				
				if (packet.id == undefined)
					packet.id = null;
				
				if (packet.method == undefined)
					throw "Missing method.";
				if (typeof packet.method != "string")
					throw "Invalid method.";
				
				if (!this.#route[packet.method]) {
					this.send({
						error: {
							code: -32601,
							message: "Method not found",
						}
					})
					return;
				}
			} catch (err: any) {
				this.send({
					error: {
						code: -32700,
						message: `Parsing Error: ${err}`,
					},
				});
			}
			
		});
	}

	send(packet: any) {
		var body = JSON.stringify(packet);
		var headers = `Content-Length: ${body.length}\r\nContent-Type: application/vscode-jsonrpc; charset=utf-8\r\n`;

		process.stdout.write(`${headers}\r\n${body}`);
	}
}
