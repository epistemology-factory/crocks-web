"use strict";

const { makeValidator } = require("./validator");
const { validationError } = require("../validation-error");
const { CONSTRAINTS, DEFAULT_MESSAGES } = require("./constraints");

// isString :: [ String ] -> a -> Result ValidationError a
const isString = makeValidator(
	require("crocks/predicates/isString"),
	validationError(
		CONSTRAINTS.IS_STRING,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_STRING]
	)
)

module.exports = {
	isString
}
