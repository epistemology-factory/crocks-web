"use strict";

const { makeValidator } = require("./validator");
const { validationError } = require("../validation-error");
const { CONSTRAINTS, DEFAULT_MESSAGES } = require("./constraints");

const isDefined = makeValidator(
	require("crocks/predicates/isDefined"),
	validationError(
		CONSTRAINTS.IS_DEFINED,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_DEFINED]
	)
)

module.exports = {
	isDefined
}
