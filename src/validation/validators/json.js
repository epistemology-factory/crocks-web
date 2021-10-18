"use strict";

const { validationFailure } = require("../validation-failure");
const { CONSTRAINTS, DEFAULT_MESSAGES } = require("./constraints");

const invalidJsonFailure = validationFailure(
	CONSTRAINTS.IS_JSON,
	DEFAULT_MESSAGES[CONSTRAINTS.IS_JSON]
)

module.exports = {
	invalidJsonFailure
}
