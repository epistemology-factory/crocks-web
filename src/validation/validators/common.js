"use strict";

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

module.exports = {
	isDefined,
	isDefinedFailure
}
