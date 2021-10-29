"use strict";

const { allOf, equalTo, hasProperties, hasProperty } = require("hamjest");

const { ERROR_TYPES } = require("../../../../web/errors");

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

const anInvalidContentTypeError = (contentType) =>
	allOf(
		anError(contentType),
		hasProperty("contentType", equalTo(contentType))
	)

const anInvalidEnvVarError = (name) => anEnvVarError(ERROR_TYPES.INVALID_ENV_VAR, name)

const anInvalidStateError = (reason) =>
	allOf(
		anError(ERROR_TYPES.INVALID_STATE),
		hasProperty("reason", reason)
	)

const aMissingEnvVarError = (name) => anEnvVarError(ERROR_TYPES.MISSING_ENV_VAR, name)

const aMissingPropError = (prop) => anInvalidStateError(`Missing prop '${prop}'`)

const aMissingPathError = (path) => aMissingPropError(path.join("."))

const aValidationError = (failures) =>
	allOf(
		anError(ERROR_TYPES.VALIDATION_ERROR),
		hasProperty("failures", failures)
	)

module.exports = {
	anError,
	anInvalidContentTypeError,
	anInvalidEnvVarError,
	anInvalidStateError,
	aMissingEnvVarError,
	aMissingPropError,
	aMissingPathError,
	aValidationError
}
