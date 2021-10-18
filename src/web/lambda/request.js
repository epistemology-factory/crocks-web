"use strict";

const bimap = require("crocks/pointfree/bimap");
const identity = require("crocks/combinators/identity");
const pipe = require("crocks/helpers/pipe");

const { isSchemaValid } = require("../../validation/validators");
const { validationError } = require("./errors");

// validateRequest :: Schema -> Object -> Result Object
const validateRequest = (schema) =>
	pipe(
		isSchemaValid(schema, []),
		bimap(validationError, identity)
	)

module.exports = {
	validateRequest
}
