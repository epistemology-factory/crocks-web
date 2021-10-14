"use strict";

const CONSTRAINTS = {
	IS_DEFINED: "is-defined",
	IS_STRING: "is-string",
}

const DEFAULT_MESSAGES = {
	[CONSTRAINTS.IS_DEFINED]: "should not be null or undefined",
	[CONSTRAINTS.IS_STRING]: "must be a string",
}

module.exports = {
	CONSTRAINTS,
	DEFAULT_MESSAGES
}
