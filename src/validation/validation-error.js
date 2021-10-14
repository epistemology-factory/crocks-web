"use strict";

const curry = require("crocks/helpers/curry");

/**
 * @typedef {Object} ValidationError
 * @property {string[]} path A path to the property that failed validation.
 * @property {Object<string, string>} constraints Constraints the failed, with error messages.
 * @property {any} value The value that failed validation.
 */

// validationError :: String -> String -> [String] -> a -> ValidationError
const validationError =
	curry((constraint, message, path, value) => ({
		path,
		constraints: {
			[constraint]: message
		},
		value
	}))

module.exports = {
	validationError
}
