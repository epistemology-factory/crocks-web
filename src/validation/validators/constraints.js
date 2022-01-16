"use strict";

const CONSTRAINTS = {
	IS_DEFINED: "is-defined",
	IS_INT_STRING: "is-int-string",
	IS_ISO_DATE: "is-iso-date",
	IS_JSON: "is-json",
	IS_OBJECT: "is-object",
	IS_STRING: "is-string",
}

const DEFAULT_MESSAGES = {
	[CONSTRAINTS.IS_DEFINED]: "should not be null or undefined",
	[CONSTRAINTS.IS_INT_STRING]: "should be an integer string",
	[CONSTRAINTS.IS_ISO_DATE]: "should be an ISO date",
	[CONSTRAINTS.IS_JSON]: "must be valid JSON",
	[CONSTRAINTS.IS_OBJECT]: "must be an object",
	[CONSTRAINTS.IS_STRING]: "must be a string",
}

module.exports = {
	CONSTRAINTS,
	DEFAULT_MESSAGES
}
