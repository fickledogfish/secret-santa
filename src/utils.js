"use strict";

// Hacking enums into JS.

/*
 * Create an enum from a bunch of strings that represent its variants.
 */
export const makeEnum = (...args) => {
	return new Enum(...args).freeze();
};

// Internal declaration; makeEnum returns the frozen object.
class Enum {
	constructor(...args) {
		args.forEach(el => this[el] = Symbol(el));
	}

	freeze() {
		return Object.freeze(this);
	}
};

/*
 * Transform the enum variant into a string.
 *
 * This could, in theory, be achieved by overwriting Symbol.prototype.toString,
 * but, although more verbose, this seems cleaner.
 */
export const stringifyEnum = (variant) => {
	const str = variant.toString(); // Symbol(variant)
	return variant.toString().slice(7, str.length - 1);
};
