"use strict";

const { allOf, hasProperty, equalTo } = require("hamjest");

const aValidationFailure = (path, constraint, message, value) =>
	allOf(
		hasProperty("path", equalTo(path)),
		hasProperty("constraints", hasProperty(constraint, equalTo(message))),
		hasProperty("value", equalTo(value))
	)

module.exports = {
	aValidationFailure
}
