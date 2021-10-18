"use strict";

const { allOf, containsString } = require("hamjest");

const { LOG_LEVEL_STRINGS } = require("../../../../logging/logger");

const aLogMessage = (level, message) =>
	allOf(
		containsString(`[${LOG_LEVEL_STRINGS[level]}]`),
		containsString(message)
	)

module.exports = {
	aLogMessage
}
