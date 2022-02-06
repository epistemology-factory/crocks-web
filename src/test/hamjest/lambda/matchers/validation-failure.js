"use strict";

const { allOf, hasProperty, equalTo } = require("hamjest");

const { CONSTRAINTS, DEFAULT_MESSAGES } = require("../../../../validation/validators");

const aValidationFailure = (path, constraint, message, value) =>
	allOf(
		hasProperty("path", equalTo(path)),
		hasProperty("constraints", hasProperty(constraint, equalTo(message))),
		hasProperty("value", equalTo(value))
	)

const isBoolStringFailure = (path, value) => {
	return aValidationFailure(
		path,
		CONSTRAINTS.IS_BOOL_STRING,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_BOOL_STRING],
		value
	);
}

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

const isIntStringFailure = (path, value) => {
	return aValidationFailure(
		path,
		CONSTRAINTS.IS_INT_STRING,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_INT_STRING],
		value
	);
}

const isNotEmptyFailure = (path, value) => {
	return aValidationFailure(
		path,
		CONSTRAINTS.IS_NOT_EMPTY,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_NOT_EMPTY],
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
	isBoolStringFailure,
	isDefinedFailure,
	isIntStringFailure,
	isNotEmptyFailure,
	isObjectFailure,
	isStringFailure
}
