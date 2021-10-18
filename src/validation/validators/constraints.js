"use strict";

const CONSTRAINTS = {
	IS_DEFINED: "is-defined",
	IS_OBJECT: "is-object",
	IS_STRING: "is-string",
}

const DEFAULT_MESSAGES = {
	[CONSTRAINTS.IS_DEFINED]: "should not be null or undefined",
	[CONSTRAINTS.IS_OBJECT]: "must be an object",
	[CONSTRAINTS.IS_STRING]: "must be a string",
}

module.exports = {
	CONSTRAINTS,
	DEFAULT_MESSAGES
}
