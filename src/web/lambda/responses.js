"use strict";

const Async = require("crocks/Async");

const compose = require("crocks/helpers/compose");
const curry = require("crocks/helpers/curry");
const isArray = require("crocks/predicates/isArray");
const isObject = require("crocks/predicates/isObject");
const option = require("crocks/pointfree/option");
const or = require("crocks/logic/or");
const pipe = require("crocks/helpers/pipe");
const safe = require("crocks/Maybe/safe");

const { stringify } = require("@epistemology-factory/crocks-ext/String");

/**
 * Transforms an object to JSON, or returns an empty object.
 */
// toJSON :: a -> String
const toJSON =
	pipe(
		compose(option({}), safe(or(isArray, isObject))),
		stringify
	)

/**
 * Creates a response object suitable to result from a Lambda to API Gateway.
 *
 * Will always return a JSON body, otherwise API Gateway doesn't like the response.
 */
// response :: Number -> Object -> a -> Object
const response = curry((code, headers, body) => ({
		statusCode: code,
		headers,
		body: toJSON(body)
	})
)

/**
 * Takes a function to transform a value into a response suitable for API Gateway.
 *
 * Useful for Kleisli composition
 */
// respondWith :: (a -> Object) -> Async Object
const respondWith = (fn) => compose(Async.of, fn)

/**
 * An error response
 */
// errorResponse :: Number -> Object -> String -> a -> Object
const errorResponse = curry((code, headers, message, cause) =>
	response(code, headers, {
		message,
		cause
	})
)

// badRequest :: Object -> String -> a -> Object
const badRequest = errorResponse(400);

// internalServerError :: Object -> String -> a -> Object
const internalServerError = errorResponse(500);

// unsupportedMediaType :: Object -> String -> Object
const unsupportedMediaType = curry((headers, contentType) =>
	errorResponse(415, headers, `'${contentType}' is unsupported`, {})
)

module.exports = {
	badRequest,
	internalServerError,
	respondWith,
	response,
	unsupportedMediaType
}
