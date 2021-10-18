"use strict";

const Async = require("crocks/Async");

const bimap = require("crocks/pointfree/bimap");
const asyncToPromise = require("crocks/Async/asyncToPromise");
const coalesce = require("crocks/pointfree/coalesce");
const compose = require("crocks/helpers/compose");
const constant = require("crocks/combinators/constant");
const curry = require("crocks/helpers/curry");
const either = require("crocks/pointfree/either");
const identity = require("crocks/combinators/identity");
const map = require("crocks/pointfree/map");
const pipe = require("crocks/helpers/pipe");

const { LOG_LEVELS } = require("../../logging/logger");

/**
 * `handler` is the interfacing function between the Lambda world, and the Crocks world.
 *
 * `handler` takes a function, which when given an object, returns an Async resolved with an
 * object representing the HTTP "success" response, or rejected with an object representing the
 * HTTP "failure" response. The Async is converted to a Promise which is returned to Lambda.
 *
 * Because Lambda expects the Promise to resolve to an object representing the HTTP response,
 * `handler` will coalesce the Async into a resolved Promise. If the Promise rejects, AWS
 * error handling will kick in, and the caller will receive a HTTP 500 with the default
 * API Gateway error message.
 *
 * Lambdas will need to perform some initialisation logic to assemble the handler.
 * For example, environment variables will need to be processed to configure the lambda, and
 * if the initialisation fails, the lambda should be configured to return an internal server
 * error to caller to indicate that the lambda instance is unusable (rather than crashing,
 * and having the default AWS Gateway error response being returned). `assembler` can be used
 * to take some initial environment and assemble the "request handler" to process incoming
 * events.
 *
 * Consequently, the provided function to `handler` should not directly encapsulate the flow
 * to process the request. `requestHandler` should orchestrate the processing of the request
 * to a response.
 */
// handler :: (Object -> Async Object) -> Object -> Promise Object
const handler = curry((fn) =>
	pipe(
		fn,
		coalesce(identity, identity),
		asyncToPromise
	)
)

/**
 * `requestHandler` encapsulates the flow of processing an HTTP request to an HTTP response.
 * `requestHandler` can be used by a handler factory to produce a request handler that can use
 * items from a config, that is created during the lambda assembly.
 *
 * `requestHandler` takes a logger, and error mapper, a success mapper and a function that can
 * process the HTTP request to an Async of an HTTP response. If the Async is Rejected, the
 * result is considered a failure and passed to the error mapper, else success is assumed.
 *
 * After mapping to an HTTP response, the Async is coalesced to a Resolved instance so that
 * the final Promise doesn't reject.
 *
 * Request/responses are logged at debug level to aid in debugging.
 */
// requestHandler :: (Integer -> String -> a -> a) -> (Object -> Object) -> (Object -> Object) -> (Object -> Async Object) -> Object -> Async Object
const requestHandler = curry((logger, errorMapper, successMapper, fn) =>
	pipe(
		logger(LOG_LEVELS.DEBUG, "request=%j"),
		fn,
		bimap(logger(LOG_LEVELS.ERROR, "Error processing request error=%j"), identity),
		bimap(errorMapper, successMapper),
		coalesce(identity, identity),
		map(logger(LOG_LEVELS.DEBUG, "response=%j"))
	)
)

// mapAssemblerError :: (Object -> Object) -> Object -> (Object -> Async Object)
const mapAssemblerError = (errorMapper) => compose(constant, Async.Rejected, errorMapper)

/**
 * `assembler` is a helper for assembling request handlers, which are the functions that process
 * HTTP requests to responses.
 *
 * `assembler` takes a logger, an error mapper, a request handler factory function, and some
 * initial environment. The factory is applied to the environment. If an error is returned, the
 * error mapper is used to convert the error to a HTTP failure response.
 *
 * The result of assembling the request handler is a function suitable to be used with `handler`
 *
 * The `logger` is only used to report assemble errors, and is not used during the processing of
 * an HTTP request.
 */
// assembler :: (Integer -> String -> a -> a) -> (Object -> Object) -> (Object -> Result Object (Object -> Async Object)) -> Object -> Object -> Promise Object
const assembler = curry((logger, errorMapper, factory) =>
	pipe(
		factory,
		bimap(logger(LOG_LEVELS.ERROR, "Can't assemble handler error=%j"), identity),
		either(mapAssemblerError(errorMapper), identity),
		handler
	)
)

module.exports = {
	assembler,
	handler,
	requestHandler
}
