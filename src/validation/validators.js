"use strict";

const Async = require("crocks/Async");
const Result = require("crocks/Result");

const constant = require("crocks/combinators/constant");
const converge = require("crocks/combinators/converge");
const liftA2 = require("crocks/helpers/liftA2");

/*
 * `validator` is a function that can be used to validate some data.
 *
 * `validator` takes an Applicative TypeRef, and a function that returns an Applicative.
 * When given a value, the value is run through the validation function.
 *
 * If the "success" case is returned, then the result of `validator` will be the original value
 * lifted into an Applicative (which is why the TypeRef is needed).
 *
 * If the the "error" case is returned, then the result of `validator` will be the validation error.
 *
 * By using Applicatives that also chainable, validation functions can be composed together where
 * the overall result is the original input, or an error.
 */
// validator :: Applicative m => TypeRef m -> (a -> m b) -> a -> m a
const validator =
	converge(liftA2(constant))

// asyncValidator :: (a -> Async b c) -> a -> Async b a
const asyncValidator = validator(Async.of)

// resultValidator :: (a -> Result b c) -> a -> Result b a
const resultValidator = validator(Result.of)

module.exports = {
	asyncValidator,
	resultValidator,
	validator,
}
