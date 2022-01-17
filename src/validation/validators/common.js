"use strict";

const not = require("crocks/logic/not");

const { makeValidator } = require("./validator");
const { validationFailure } = require("../validation-failure");
const { CONSTRAINTS, DEFAULT_MESSAGES } = require("./constraints");

// isDefinedFailure :: [String] -> a -> ValidationFailure
const isDefinedFailure = validationFailure(
	CONSTRAINTS.IS_DEFINED,
	DEFAULT_MESSAGES[CONSTRAINTS.IS_DEFINED]
)

const isDefined = makeValidator(
	require("crocks/predicates/isDefined"),
	isDefinedFailure
)

const isNotEmpty = makeValidator(
	not(require("crocks/predicates/isEmpty")),
	validationFailure(
		CONSTRAINTS.IS_NOT_EMPTY,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_NOT_EMPTY]
	)
);

module.exports = {
	isDefined,
	isDefinedFailure,
	isNotEmpty
}
