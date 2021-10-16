"use strict";

const curry = require("crocks/helpers/curry");

/**
 * @typedef {Object} ValidationFailure
 * @property {string[]} path A path to the property that failed validation.
 * @property {Object<string, string>} constraints Constraints the failed, with error messages.
 * @property {any} value The value that failed validation.
 */

// validationFailure :: String -> String -> [String] -> a -> ValidationFailure
const validationFailure =
	curry((constraint, message, path, value) => ({
		path,
		constraints: {
			[constraint]: message
		},
		value
	}))

module.exports = {
	validationFailure
}
