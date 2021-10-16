"use strict";

const ERROR_TYPES = {
	VALIDATION_ERRORS: "validation-errors"
}

// validationError :: [ValidationFailures] -> Object
const validationError = (failures) => ({
	type: ERROR_TYPES.VALIDATION_ERRORS,
	failures
})

module.exports = {
	ERROR_TYPES,
	validationError
}
