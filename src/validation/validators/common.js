"use strict";

const Result = require("crocks/Result");

const curry = require("crocks/helpers/curry");
const map = require("crocks/pointfree/map");
const not = require("crocks/logic/not");
const option = require("crocks/pointfree/option");
const pipe = require("crocks/helpers/pipe");
const safe = require("crocks/Maybe/safe");

const { makeValidator } = require("./validator");
const { validationFailure } = require("../validation-failure");
const { CONSTRAINTS, DEFAULT_MESSAGES } = require("./constraints");

// ifPresent :: ([ String ] -> a -> Result ValidationFailure a) -> [ String ] -> a -> Result ValidationFailure a
const ifPresent = curry((validator, path) =>
	pipe(
		safe(require("crocks/predicates/isDefined")),
		map(validator(path)),
		option(Result.Ok(undefined))
	)
)

// isDefinedFailure :: [String] -> a -> ValidationFailure
const isDefinedFailure = validationFailure(
	CONSTRAINTS.IS_DEFINED,
	DEFAULT_MESSAGES[CONSTRAINTS.IS_DEFINED]
)

// isDefined :: [ String ] -> a -> Result ValidationFailure a
const isDefined = makeValidator(
	require("crocks/predicates/isDefined"),
	isDefinedFailure
)

// isNotEmpty :: [ String ] -> a -> Result ValidationFailure a
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
	ifPresent: curry(ifPresent),
	isNotEmpty
}
