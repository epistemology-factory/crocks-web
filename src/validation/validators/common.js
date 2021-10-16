"use strict";

const { makeValidator } = require("./validator");
const { validationFailure } = require("../validation-failure");
const { CONSTRAINTS, DEFAULT_MESSAGES } = require("./constraints");

const isDefined = makeValidator(
	require("crocks/predicates/isDefined"),
	validationFailure(
		CONSTRAINTS.IS_DEFINED,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_DEFINED]
	)
)

module.exports = {
	isDefined
}
