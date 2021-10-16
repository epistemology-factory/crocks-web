"use strict";

const { equalTo, hasProperties } = require("hamjest");

const aResponse = (code, headers, body) =>
	hasProperties({
		statusCode: equalTo(code),
		headers: equalTo(headers),
		body: equalTo(JSON.stringify(body))
	})

const anInternalServerError = (headers, message, cause) =>
	aResponse(500, headers, {
		message,
		cause
	})

module.exports = {
	anInternalServerError,
	aResponse
}
