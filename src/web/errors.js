"use strict";

const { format } = require("util");

const compose = require("crocks/helpers/compose");
const flip = require("crocks/combinators/flip");
const objOf = require("crocks/helpers/objOf");
const partial = require("crocks/helpers/partial");
const pipe = require("crocks/helpers/pipe");
const setProp = require("crocks/helpers/setProp");

const { join } = require("@epistemology-factory/crocks-ext/String");

const ERROR_TYPES = {
	INVALID_CONTENT_TYPE: "invalid-content-type",
	INVALID_ENV_VAR: "invalid-env-var",
	INVALID_STATE: "invalid-state",
	MISSING_ENV_VAR: "missing-env-var",
	VALIDATION_ERROR: "validation-error"
}

// envVarError :: String -> String -> Object
const envVarError = (type) =>
	pipe(
		objOf("name"),
		setProp("type", type)
	)

// invalidContentType :: String -> Object
const invalidContentType =
	flip(setProp("contentType"), {
		type: ERROR_TYPES.INVALID_CONTENT_TYPE
	})

// invalidEnvVar :: String -> Object
const invalidEnvVar = envVarError(ERROR_TYPES.INVALID_ENV_VAR)

// invalidState :: String -> Object
const invalidState =
	flip(setProp("reason"), {
		type: ERROR_TYPES.INVALID_STATE
	})

// missingEnvVar :: String -> Object
const missingEnvVar = envVarError(ERROR_TYPES.MISSING_ENV_VAR)

// missingProp :: String -> Object
const missingProp =
	compose(invalidState, partial(format, "Missing prop '%s'"))

// missingPath :: [ String ] -> Object
const missingPath =
	compose(missingProp, join("."))

// validationError :: [ValidationFailures] -> Object
const validationError = (failures) => ({
	type: ERROR_TYPES.VALIDATION_ERROR,
	failures
})

module.exports = {
	ERROR_TYPES,
	invalidContentType,
	invalidEnvVar,
	invalidState,
	missingEnvVar,
	missingProp,
	missingPath,
	validationError
}
