"use strict";

const bimap = require("crocks/pointfree/bimap");
const compose = require("crocks/helpers/compose");
const constant = require("crocks/combinators/constant");
const converge = require("crocks/combinators/converge");
const curry = require("crocks/helpers/curry");
const flip = require("crocks/combinators/flip");
const identity = require("crocks/combinators/identity");
const pipe = require("crocks/helpers/pipe");
const pipeK = require("crocks/helpers/pipeK");

const { getPath } = require("@epistemology-factory/crocks-ext/Result");
const { parse } = require("@epistemology-factory/crocks-ext/node/json");

const { invalidJsonFailure } = require("../../validation/validators/json");
const { isSchemaValid, isDefinedFailure } = require("../../validation/validators");
const { validationError } = require("./errors");

// toArray :: a -> [ a ]
const toArray = (x) => [ x ]

const missingBody =
	pipe(
		compose(toArray, flip(isDefinedFailure, undefined)),
		validationError
	)

// parseJSON :: [ String ] -> a -> Result Object Object
const parseJSON = curry((path) =>
	converge(
		flip(bimap, identity),
		compose(constant, validationError, toArray, invalidJsonFailure(path)),
		parse
	)
)

// parseBody :: (a -> Result Object) -> Object -> Result Object
const parseBody = curry((parse) =>
	pipeK(
		getPath(missingBody, [ "body" ]),
		parse([ "body" ])
	)
)

// validateRequest :: Schema -> Object -> Result Object
const validateRequest = (schema) =>
	pipe(
		isSchemaValid(schema, []),
		bimap(validationError, identity)
	)

// validateBody :: Schema -> Object -> Result Object
const validateBody = (schema) =>
	pipe(
		isSchemaValid(schema, [ "body" ]),
		bimap(validationError, identity)
	)

module.exports = {
	parseBody,
	parseJSON,
	validateBody,
	validateRequest
}
