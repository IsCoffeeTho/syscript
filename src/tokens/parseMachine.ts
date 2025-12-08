export type parseMachine<T = any> = {
	peek(): T;
	next(): T;
	hasNext(): boolean;
};

export default function wrapParseMachine<T = any>(gen: { consume: () => T; available: () => boolean }): parseMachine<T> {
	var consumable = gen.available();
	var prioirConsumed: T;
	return {
		peek() {
			return prioirConsumed;
		},
		next() {
			prioirConsumed = gen.consume();
			consumable = gen.available();
			return prioirConsumed;
		},
		hasNext: () => consumable,
	};
}
