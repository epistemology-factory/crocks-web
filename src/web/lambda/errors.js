"use strict";

const applyTo = require("crocks/combinators/applyTo");
const compose = require("crocks/helpers/compose");
const converge = require("crocks/combinators/converge");
const constant = require("crocks/combinators/constant");
const curry = require("crocks/helpers/curry");
const getProp = require("crocks/Maybe/getProp");
const identity = require("crocks/combinators/identity");
const isDefined = require("crocks/predicates/isDefined");
const flip = require("crocks/combinators/flip");
const map = require("crocks/pointfree/map");
const option = require("crocks/pointfree/option");
const pipe = require("crocks/helpers/pipe");
const safe = require("crocks/Maybe/safe");
const substitution = require("crocks/combinators/substitution");

const { internalServerError } = require("./responses");

const ERROR_TYPES = {
	VALIDATION_ERRORS: "validation-errors"
}

// genericError :: (Object -> String) -> Object -> Object
const genericError = 	substitution(flip(internalServerError({})))

// fatalError :: Object -> Object
const fatalError = genericError(({ type }) => `Unknown error type '${type}'`)

// systemError :: Object -> Object
const systemError = genericError(constant("System error"))

// getErrorHandler :: Object -> String -> Object -> Object
const getErrorHandler = curry((mappings) =>
	pipe(
		safe(isDefined),
		map(compose(option(fatalError), flip(getProp, mappings))),
		option(systemError)
	)
)

// mapError :: Object -> Object -> Object
const mapError = curry((mappings) =>
	converge(
		applyTo,
		identity,
		({ type }) => getErrorHandler(mappings, type),
	)
)

module.exports = {
	ERROR_TYPES,
	mapError
}
