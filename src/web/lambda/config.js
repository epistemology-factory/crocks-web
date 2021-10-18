"use strict";

const Assign = require("crocks/Assign");

const compose = require("crocks/helpers/compose");
const flip = require("crocks/combinators/flip");
const getPropOr = require("crocks/helpers/getPropOr");
const map = require("crocks/pointfree/map");
const objOf = require("crocks/helpers/objOf");
const pipe = require("crocks/helpers/pipe");

const { getProp } = require("@epistemology-factory/crocks-ext/Result");

const { LOG_LEVELS, LOG_LEVEL_STRINGS } = require("../../logging/logger");
const { invalidEnvVar } = require("./errors");

// getLogger :: (Integer -> Integer -> String -> a -> a) -> Object -> Result Object Assign
const getLogger = (logger) =>
	pipe(
		getPropOr(LOG_LEVEL_STRINGS[LOG_LEVELS.INFO], "LOG_LEVEL"),
		flip(getProp(() => invalidEnvVar("LOG_LEVEL")), LOG_LEVELS),
		map(compose(Assign, objOf("logger"), logger))
	)

module.exports = {
	getLogger
}
