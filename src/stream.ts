export default class Stream<T = any> {
	#i : number = -1;
	#iterable: T[];
	constructor(iterable: T[]) {
		this.#iterable = iterable;
	}
	
	get position() {
		return this.#i;
	}
	
	peek() {
		return this.#iterable[this.#i];
	}
	
	next() {
		return this.#iterable[++this.#i];
	}
	
	hasNext() {
		return this.#i <= this.#iterable.length;
	}
}