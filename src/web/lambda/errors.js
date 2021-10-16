"use strict";

const ERROR_TYPES = {
	VALIDATION_ERROR: "validation-error"
}

// validationError :: [ValidationFailures] -> Object
const validationError = (failures) => ({
	type: ERROR_TYPES.VALIDATION_ERROR,
	failures
})

module.exports = {
	ERROR_TYPES,
	validationError
}
