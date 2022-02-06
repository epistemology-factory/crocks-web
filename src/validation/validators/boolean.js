"use strict";

const isSame = require("crocks/predicates/isSame");
const or = require("crocks/logic/or");

const { makeValidator } = require("./validator");
const { validationFailure } = require("../validation-failure");
const { CONSTRAINTS, DEFAULT_MESSAGES } = require("./constraints");

// isBoolString :: [ String ] -> String -> Result ValidationFailure String
const isBoolString = makeValidator(
	or(isSame("true"), isSame("false")),
	validationFailure(
		CONSTRAINTS.IS_BOOL_STRING,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_BOOL_STRING]
	)
)

module.exports = {
	isBoolString
}
