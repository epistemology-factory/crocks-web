"use strict";

const First = require("crocks/First");
const Result = require("crocks/Result");

const assign = require("crocks/helpers/assign");
const compose = require("crocks/helpers/compose");
const curry = require("crocks/helpers/curry");
const either = require("crocks/pointfree/either");
const foldMap = require("crocks/pointfree/foldMap");
const getProp = require("crocks/Maybe/getProp");
const map = require("crocks/pointfree/map");
const option = require("crocks/pointfree/option");
const pipe = require("crocks/helpers/pipe");
const reduce = require("crocks/pointfree/reduce");
const valueOf = require("crocks/pointfree/valueOf");

const { applyFunctor } = require("@epistemology-factory/crocks-ext/helpers");
const {
	capitalise,
	join,
	lowerCase,
	split
} = require("@epistemology-factory/crocks-ext/String");

const defaultCorsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent"
}

// joinDash :: [ String ] -> String
const joinDash = join("-")

// splitDash :: String -> [ String ]
const splitDash = split("-")

// changeCase :: (String -> String) -> String -> String
const changeCase = (fn) => compose(joinDash, map(fn), splitDash)

// lowercased :: String -> String
const lowercased = changeCase(lowerCase)

// capitalised :: String -> String
const capitalised = changeCase(capitalise)

// getHeaderVariation :: (String -> String) -> String -> a -> Maybe b
const getHeaderVariation = (fn) => compose(getProp, fn)

// variations :: [ (String -> a -> Maybe b) ]
const variations = [
	getHeaderVariation(lowercased),
	getHeaderVariation(capitalised)
]

/*
 * `getHeader` looks for a header in an object, but will check for the presence of the key
 * taking into account variations in how headers are capitalised.
 *
 * Will check for headers
 * - lowercased eg: 'origin' or 'content-type'
 * - capitalised eg: 'Origin' or 'Content-Type'
 */
// getHeader :: String -> a -> Maybe b
const getHeader = curry((header) =>
	pipe(
		applyFunctor(applyFunctor(variations, header)),
		compose(valueOf, foldMap(First))
	)
)

const getHeaderOr = curry((value, header) =>
	compose(option(value), getHeader(header))
)

/*
 * An error function will be called with the header name if the header is not found in any
 * variation.
 */
// getHeaderOrErr :: (String -> a) -> String -> b -> Result a c
const getHeaderOrErr = curry((error, header) =>
	compose(either(() => Result.Err(error(header)), Result.Ok), getHeader(header))
)

/**
 * Merges header objects together. The first value for a given key is preserved, so
 * order of input matters.
 */
// mergeHeaders :: ...Object -> Object
const mergeHeaders = (...headers) => reduce(assign, {}, headers)

module.exports = {
	defaultCorsHeaders,
	getHeader,
	getHeaderOr,
	getHeaderOrErr,
	mergeHeaders
}
