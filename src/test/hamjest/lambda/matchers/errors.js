"use strict";

const { allOf, equalTo, hasProperties } = require("hamjest");

const { ERROR_TYPES } = require("../../../../web/lambda/errors");

// anError = (String) -> Matcher
const anError = (type) =>
	hasProperties({
		type: equalTo(type)
	})

const anEnvVarError = (type, name) =>
	allOf(
		anError(type),
		hasProperties({
			name: equalTo(name)
		})
	)

const anInvalidEnvVar = (name) => anEnvVarError(ERROR_TYPES.INVALID_ENV_VAR, name)

const aMissingEnvVar = (name) => anEnvVarError(ERROR_TYPES.MISSING_ENV_VAR, name)

module.exports = {
	anError,
	anInvalidEnvVar,
	aMissingEnvVar
}
