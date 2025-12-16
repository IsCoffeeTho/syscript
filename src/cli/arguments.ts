type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
	Pick<T, Exclude<keyof T, Keys>>
	& {
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
	}[Keys];

type optionDescriptor = RequireAtLeastOne<{
	parameter: string,
	flag: string,
}> &
{
	description: string,
	args?: string[],
	trigger: (...varg: string[]) => any
};

export default function parseArguments(progName: string, options: optionDescriptor[], defaultTrigger: (arg: string) => any) {
	options.push(
		{
			parameter: "help",
			flag: 'h',
			description: `Shows this help screen`,
			trigger() {
				console.log(`${progName} [options] <inputfiles>\n`);
				for (var option of options) {
					var optionsParameters = option.args ?? [];
					if (option.flag) console.log(`  ${progName} --${option.flag} ${optionsParameters.map((v) => `<${v}>`).join(" ")}`);
					if (option.parameter) console.log(`  ${progName} --${option.parameter} ${optionsParameters.map((v) => `<${v}>`).join(" ")}`);
					console.log(`    ${option.description.trim()}\n`);
				}
				process.exit(0);
			}
		}
	)
	options.sort((a, b) => {
		var a_real = a.parameter ?? a.flag ?? "";
		var b_real = b.parameter ?? b.flag ?? "";
		const n = Math.max(a_real.length, b_real.length);
		for (var i = 0; i < n; i++) {
			var _a = a_real.charCodeAt(i);
			if (Number.isNaN(_a)) return 1;
			var _b = b_real.charCodeAt(i);
			if (Number.isNaN(_b)) return -1;
			if (_a - _b) return _a - _b;
		}
		return 0;
	});
	var args = process.argv;
	args.shift();
	args.shift();
	for (var idx = 0; idx < args.length; idx++) {
		var arg = <string>args[idx];
		var option: optionDescriptor | undefined;
		if (arg.startsWith('-')) {
			if (arg.startsWith('-', 1))
				option = options.find((v) => {
					return v.parameter == arg.slice(2)
				})
			else
				option = options.find((v) => {
					return v.flag == arg[1]
				})
			if (option) {
				var params = option.args ?? [];
				var provide: string[] = [];
				for (var param of params) {
					var provided = args[++idx];
					if (!provided) {
						process.stderr.write(`Parameter "${arg} ${params.map((v) => `<${v}>`).join(" ")}" is missing "<${param}>"\nTo see valid usage run:\n\n${progName} -h\n`);
						process.exit(1);
					}
					provide.push();
				}
				option.trigger();
				continue;
			}
			process.stderr.write(`Unknown paramater "${arg}"\nTo see valid parameters run:\n\n${progName} -h\n`);
			process.exit(1);
		} else {
			defaultTrigger(arg);
		}
	}
}