"use strict";

const objOf = require("crocks/helpers/objOf");
const pipe = require("crocks/helpers/pipe");
const setProp = require("crocks/helpers/setProp");

const ERROR_TYPES = {
	INVALID_ENV_VAR: "invalid-env-var",
	MISSING_ENV_VAR: "missing-env-var",
	VALIDATION_ERROR: "validation-error"
}

// validationError :: [ValidationFailures] -> Object
const validationError = (failures) => ({
	type: ERROR_TYPES.VALIDATION_ERROR,
	failures
})

// envVarError :: String -> String -> Object
const envVarError = (type) =>
	pipe(
		objOf("name"),
		setProp("type", type)
	)

// invalidEnvVar :: String -> Object
const invalidEnvVar = envVarError(ERROR_TYPES.INVALID_ENV_VAR)

// missingEnvVar :: String -> Object
const missingEnvVar = envVarError(ERROR_TYPES.MISSING_ENV_VAR)

module.exports = {
	ERROR_TYPES,
	invalidEnvVar,
	missingEnvVar,
	validationError
}
