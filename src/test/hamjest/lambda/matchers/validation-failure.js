"use strict";

const { allOf, hasProperty, equalTo } = require("hamjest");

const { CONSTRAINTS, DEFAULT_MESSAGES } = require("../../../../validation/validators");

const aValidationFailure = (path, constraint, message, value) =>
	allOf(
		hasProperty("path", equalTo(path)),
		hasProperty("constraints", hasProperty(constraint, equalTo(message))),
		hasProperty("value", equalTo(value))
	)

const isDefinedFailure = (path) => {
	return aValidationFailure(
		path,
		CONSTRAINTS.IS_DEFINED,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_DEFINED],
		undefined
	);
}

const isObjectFailure = (path, value) => {
	return aValidationFailure(
		path,
		CONSTRAINTS.IS_OBJECT,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_OBJECT],
		value
	);
}

const isStringFailure = (path, value) => {
	return aValidationFailure(
		path,
		CONSTRAINTS.IS_STRING,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_STRING],
		value
	);
}

module.exports = {
	aValidationFailure,
	isDefinedFailure,
	isObjectFailure,
	isStringFailure
}
