"use strict";

const { format } = require("util");
const { Transform } = require("stream");

const Async = require("crocks/Async");
const Result = require("crocks/Result");

const compose = require("crocks/helpers/compose");
const constant = require("crocks/combinators/constant");
const curry = require("crocks/helpers/curry");
const identity = require("crocks/combinators/identity");
const ifElse = require("crocks/logic/ifElse");
const nAry = require("crocks/helpers/nAry");
const partial = require("crocks/helpers/partial");
const tap = require("crocks/helpers/tap");

const LOG_LEVELS = {
	NONE: 0,
	ERROR: 50,
	WARN: 100,
	INFO: 150,
	VERBOSE: 200,
	DEBUG: 250
}

const LOG_LEVEL_STRINGS = {
	0: "NONE",
	50: "ERROR",
	100: "WARN",
	150: "INFO",
	200: "VERBOSE",
	250: "DEBUG"
}

class LogLineStream extends Transform {
	constructor() {
		super({
			defaultEncoding: "utf8"
		});
	}

	_transform(chunk, encoding, callback) {
		this.push(chunk, encoding);
		this.push("\n");

		callback();
	}
}

// gteq :: (Number, Number) -> Boolean
const gteq = (a, b) => a >= b

// write :: WritableStream -> a -> Boolean
const write = curry((stream, data) => stream.write(data))

/*
 * `log` takes a writeable stream, the target log level, the level for the message, a
 * printf compatible string and some data.
 *
 * If the level for the message is less than or equal to the target level the data is formatted
 * with printf and written to the stream.
 *
 * The data is returned, in this way `log` works like `tap`.
 */
// log :: WritableStream -> Integer -> Integer -> String -> a -> a
const log = curry((dest, target, level, message, data) =>
	ifElse(
		constant(gteq(target, level)),
		tap(compose(write(dest), partial(format, `[${LOG_LEVEL_STRINGS[level]}]: ${message}`))),
		identity
	)(data)
)

/*
 * Fugly as `pipe` returns the dest stream, not the source.
 */
const consoleLogger = (function() {
	let dest = new LogLineStream();
	dest.pipe(process.stdout)

	return log(dest)
}())

/*
 * `logK` takes whatever is logged and wraps it in a Chainable. The resulting function
 * can be used in Kliesli compositions.
 */
// logK :: Chain m => (a -> m a) -> (Integer -> String -> a -> a) -> Integer -> String -> a -> m a
const logK = curry((fn, log) =>
	nAry(3, compose(fn, log))
)

// asyncLogK :: (Integer -> String -> a -> a) -> Integer -> String -> a -> Async a
const asyncLogK = logK(Async.Resolved)

// resultLogK :: (Integer -> String -> a -> a) -> Integer -> String -> a -> Result a
const resultLogK = logK(Result.Ok)

module.exports = {
	LOG_LEVELS,
	LogLineStream,
	asyncLogK,
	consoleLogger,
	logK,
	log,
	resultLogK
}
