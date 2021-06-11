"use strict";

import test from "ava";

import * as u from "./utils.js";

test("makeEnum", t => {
	const variants = ["hey", "ye", "yea", "isaidhey"];
	const e = u.makeEnum(...variants);

	// Since symbols cannot be compared with anything other than themselves,
	// there isn't much that can be tested here.

	// All variants must be Symbols.
	Object.entries(e).forEach(([_, value]) => t.is(typeof value, "symbol"));

	// All variants are Symbols with descriptions, and Symbol.toString shows
	// what it is, so check against that.
	variants.forEach(v => t.is(`Symbol(${v})`, e[v].toString()));
});

test("stringifyEnum", t => {
	const variants = ["niceTest", "first", "noYoureNot", "im also valid"];
	const e = u.makeEnum(...variants);

	// Stringificatin should result in the original string used to create the
	// enum.
	variants.forEach(v => t.is(v, u.stringifyEnum(e[v])));
});
