"use strict";

const Result = require("crocks/Result");

const chain = require("crocks/pointfree/chain");
const compose = require("crocks/helpers/compose");
const contramap = require("crocks/pointfree/contramap");
const curry = require("crocks/helpers/curry");
const ifElse = require("crocks/logic/ifElse");
const flip = require("crocks/combinators/flip");
const pipe = require("crocks/helpers/pipe");
const reduce = require("crocks/pointfree/reduce");

const { applyFunctor } = require("@epistemology-factory/crocks-ext/helpers");

// makeValidator :: (a -> Boolean) -> ([ String ] -> a -> ValidationFailure) -> [ String ] -> a -> Result ValidationFailure a
const makeValidator = curry((pred, err) => (path) =>
	ifElse(
		pred,
		Result.Ok,
		compose(Result.Err, err(path))
	)
)

// validators :: Foldable f => f -> [ String ] -> a -> Result ValidationFailure a
const validators = (...validators) =>
	pipe(
		applyFunctor(validators),
		flip(reduce(flip(chain))),
		contramap(Result.Ok)
	)

module.exports = {
	makeValidator,
	validators
}
