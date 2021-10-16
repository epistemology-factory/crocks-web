"use strict";

const { makeValidator } = require("./validator");
const { validationFailure } = require("../validation-failure");
const { CONSTRAINTS, DEFAULT_MESSAGES } = require("./constraints");

// isString :: [ String ] -> a -> Result ValidationFailure a
const isString = makeValidator(
	require("crocks/predicates/isString"),
	validationFailure(
		CONSTRAINTS.IS_STRING,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_STRING]
	)
)

module.exports = {
	isString
}
