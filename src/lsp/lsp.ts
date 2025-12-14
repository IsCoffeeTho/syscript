import { EventEmitter } from "events";

type rpcMsg = {
	id?: string | number | null;
};
type rpcReqMsg<M extends string = string, P extends any[] | object | undefined = undefined> = rpcMsg & {
	method: M;
	params: P;
};
type rpcResMsg<D extends object | undefined = undefined> = rpcMsg & {
	result: D;
};
type rpcResErrorMsg<D extends object | undefined = undefined> = rpcMsg & {
	error: {
		code: number;
		message: string;
		data: D;
	};
};

type rpcPacket<D extends object | undefined = undefined> = rpcResMsg<D> | rpcResErrorMsg<D> | rpcReqMsg<string, D>;

const randBucket = "012346789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default class sysLSP extends EventEmitter {
	#responseQueue: { [id: string]: rpcResMsg } = {};
	constructor(configFile: string) {
		super();
		process.stdin.on("data", buf => {
			try {
				var [headerPart, ...bodyParts] = buf.toString().split("\r\n\r\n");
				var headers = (<string>headerPart).split("\r\n");
				var body = bodyParts.join("\r\n\r\n");
				if (!headers || !body)
					throw new Error("Parse Error");
			} catch (err) {
				return this.send(<rpcResErrorMsg<undefined>>{
					error: {
						code: -32700,
						message: "Parse Error"
					}
				});
			}
			var contentLengthHeader = headers.find(v => v.startsWith("Content-Length: "));
			if (!contentLengthHeader)
				return this.send(<rpcResErrorMsg<undefined>>{
					error: {
						code: -32600,
						message: "Invalid Request; Missing Content-Length header."
					}
				});
			var contentLength = parseInt(contentLengthHeader.slice("Content-Length: ".length));
			if (isNaN(contentLength))
				return this.send(<rpcResErrorMsg<undefined>>{
					error: {
						code: -32600,
						message: "Invalid Content-Length header."
					}
				});
			body = body.slice(contentLength);
			try {
				var data = JSON.stringify(body);
			} catch (err) {
				return this.send(<rpcResErrorMsg<undefined>>{
					error: {
						code: -32700,
						message: "Could not parse body."
					}
				});
			}
			this.emit("message", data);
		});
		this.on("message", (data: rpcPacket<any>) => {
			console.error(data);
		});
	}

	async request(opt: rpcReqMsg) {
		const msgid = ".".repeat(32).replace(/./g, _ => <string>randBucket[Math.floor(Math.random() * randBucket.length)]);
		opt.id = msgid;
		this.send(opt);
		while (!this.#responseQueue[msgid]) {
			await Bun.sleep(0);
		}
		var res = this.#responseQueue[msgid];
		// @ts-ignore
		this.#responseQueue[msgid] = undefined;
		return res;
	}

	notify(opt: rpcResMsg<any>) {
		this.send(opt);
	}
	
	send(opt: rpcPacket<any>) {
		var body = JSON.stringify(opt);
		var headers = [`Content-Length: ${body.length}`, `Content-Type: application/vscode-jsonrpc; charset=utf8`].map(v => `${v}\r\n`);
		process.stdout.write(`${headers.join("")}\r\n${body}`);
	}
}
