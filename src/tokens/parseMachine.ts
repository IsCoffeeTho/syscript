export type parseMachine<T = any> = {
	peek(): T;
	next(): T;
	push(v: T): void;
	hasNext(): boolean;
	context?: any;
};

export default function wrapParseMachine<T = any>(gen: { consume: () => T; available: () => boolean; context?: any }): parseMachine<T> {
	var pushedArray: T[] = [];

	var consumable = gen.available();
	var prioirConsumed: T;
	return {
		push(v: T) {
			pushedArray.push(v);
		},
		peek() {
			return prioirConsumed;
		},
		next() {
			if (pushedArray.length > 0) {
				prioirConsumed = <T>pushedArray.pop();
				consumable = pushedArray.length > 0 || gen.available();
				return prioirConsumed;
			}
			prioirConsumed = gen.consume();
			consumable = gen.available();
			return prioirConsumed;
		},
		hasNext: () => consumable,
		context: gen.context,
	};
}
