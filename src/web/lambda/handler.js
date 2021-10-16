"use strict";

const asyncToPromise = require("crocks/Async/asyncToPromise");
const coalesce = require("crocks/pointfree/coalesce");
const curry = require("crocks/helpers/curry");
const identity = require("crocks/combinators/identity");
const pipe = require("crocks/helpers/pipe");

/**
 * In order to return our response to the caller we have to convert any
 * error response into an Async.Resolved so that the Promise resolves.
 *
 * Else the Promise will reject and AWS error handling will kick in.
 */
// returnResponse :: Async Object -> Async Object
const returnResponse = coalesce(identity, identity)

/**
 * A lambda handler that returns an object describing an HTTP response
 */
// handler :: (Object -> Async Object) -> Object -> Promise Object
const handler = curry((fn) =>
	pipe(
		fn,
		returnResponse,
		asyncToPromise
	)
)

module.exports = {
	handler
}
