"use strict";

const Result = require("crocks/Result");

const bimap = require("crocks/pointfree/bimap");
const constant = require("crocks/combinators/constant");
const curry = require("crocks/helpers/curry");
const getPropOr = require("crocks/helpers/getPropOr");
const identity = require("crocks/combinators/identity");
const isArray = require("crocks/core/isArray");
const map = require("crocks/pointfree/map");
const merge = require("crocks/pointfree/merge");
const pipe = require("crocks/helpers/pipe");
const toPairs = require("crocks/Pair/toPairs");
const traverse = require("crocks/pointfree/traverse");

const { prepend } = require("@epistemology-factory/crocks-ext/helpers");

const { makeValidator } = require("./validator");
const { validationFailure } = require("../validation-failure");
const { CONSTRAINTS, DEFAULT_MESSAGES } = require("./constraints");

/**
 *  Schema :: {
 *    [string]: [String] -> a -> Result String a
 *    [string]: [String] -> a -> Result [String] a
 *  }
 */

// isObject :: [ String ] -> a -> Result ValidationFailure a
const isObject = makeValidator(
	require("crocks/predicates/isObject"),
	validationFailure(
		CONSTRAINTS.IS_OBJECT,
		DEFAULT_MESSAGES[CONSTRAINTS.IS_OBJECT]
	)
)

/**
 * Allows an object to validated against a schema
 *
 * @param {Schema} schema The schema to validated the object against
 * @param {string[]} path A path to the object that is being validated
 * @param {Object} object The object being validated.
 */
/*
 * @see https://www.freecodecamp.org/news/functional-programming-patterns-cookbook-3a0dfe2d7e0a
 */
// isSchemaValid :: Schema -> [String] -> Object -> Result [ValidationFailure] Object
const isSchemaValid = curry((schema, path, object) =>
	pipe(
		toPairs,
		traverse(Result, merge((key, validator) =>
			pipe(
				getPropOr(undefined, key),
				validator(prepend(path, [ key ])),
				bimap((error) => isArray(error) ? error : [ error ], identity)
			)(object)
		)),
		map(constant(object))
	)(schema)
)

// TODO: list validator

// TODO: Optional props validator

module.exports = {
	isObject,
	isSchemaValid
}
