"use strict";

const curry = require("crocks/helpers/curry");

const { makeValidator } = require("./validator");
const { validationFailure } = require("../validation-failure");
const { CONSTRAINTS, DEFAULT_MESSAGES } = require("./constraints");

// matchesRegex :: RegExp -> String -> Boolean
const matchesRegex = curry((regexp, str) => regexp.test(str))

// isISODate :: [ String ] -> a -> Result ValidationFailure a
const isISODate = makeValidator(
	matchesRegex(/^\d{4}-\d{2}-\d{2}$/),
	validationFailure(
		CONSTRAINTS.IS_ISO_DATE,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_ISO_DATE]
	)
);

// isString :: [ String ] -> a -> Result ValidationFailure a
const isString = makeValidator(
	require("crocks/predicates/isString"),
	validationFailure(
		CONSTRAINTS.IS_STRING,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_STRING]
	)
)

// isIntString :: [ String ] -> a -> Result ValidationFailure a
const isIntString = makeValidator(
	matchesRegex(/^\d+$/),
	validationFailure(
		CONSTRAINTS.IS_INT_STRING,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_INT_STRING]
	)
)

module.exports = {
	isIntString,
	isISODate,
	isString
}
