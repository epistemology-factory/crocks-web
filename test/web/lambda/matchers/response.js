"use strict";

const { partial } = require("crocks");

const { equalTo, hasProperties } = require("hamjest");

const aResponse = (code, headers, body) =>
	hasProperties({
		statusCode: equalTo(code),
		headers: equalTo(headers),
		body: equalTo(JSON.stringify(body))
	})

const anErrorResponse = (code, headers, message, cause) =>
	aResponse(code, headers, {
		message,
		cause
	})

const aBadRequest = partial(anErrorResponse, 400)

const anInternalServerError = partial(anErrorResponse, 500)

module.exports = {
	aBadRequest,
	anInternalServerError,
	aResponse
}
