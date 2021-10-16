"use strict";

const Result = require("crocks/Result");

const compose = require("crocks/helpers/compose");
const curry = require("crocks/helpers/curry");
const ifElse = require("crocks/logic/ifElse");

// makeValidator :: (a -> Boolean) -> ([ String ] -> a -> ValidationFailure) -> [ String ] -> a -> Result ValidationFailure a
const makeValidator = curry((pred, err) => (path) =>
	ifElse(
		pred,
		Result.Ok,
		compose(Result.Err, err(path))
	)
)

module.exports = {
	makeValidator
}
