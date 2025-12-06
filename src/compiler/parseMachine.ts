export type parseMachine<T = any> = {
	peek(): T,
	next(): T,
	hasNext(): boolean
};

export default function wrapParseMachine<T = any>(gen: { consume: () => T, available: () => boolean}): parseMachine<T> {
	var prioirConsumed: T = gen.consume();
	var consumable = gen.available();
	return {
		peek() { 
			return prioirConsumed;
		},
		next() {
			var t = prioirConsumed;
			prioirConsumed = gen.consume();
			consumable = gen.available();
			return t;
		},
		hasNext: () => consumable,
	};
}
