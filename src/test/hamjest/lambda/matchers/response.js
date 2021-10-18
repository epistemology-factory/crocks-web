"use strict";

const { partial } = require("crocks");

const { equalTo, hasProperties } = require("hamjest");

// aResponse :: (Integer -> Object -> Object) -> Matcher
const aResponse = (code, headers, body) =>
	hasProperties({
		statusCode: equalTo(code),
		headers: equalTo(headers),
		body: equalTo(JSON.stringify(body))
	})

// anErrorResponse :: (Integer, Object, String, a) -> Matcher
const anErrorResponse = (code, headers, message, cause) =>
	aResponse(code, headers, {
		message,
		cause
	})

// aBadRequest :: (Object, String, a) -> Matcher
const aBadRequest = partial(anErrorResponse, 400)

// anInternalServerError :: (Object, String, a) -> Matcher
const anInternalServerError = partial(anErrorResponse, 500)

// anUnsupportedMediaType :: (Object, String) -> Matcher
const anUnsupportedMediaType = (headers, contentType) => anErrorResponse(
	415,
	headers,
	`'${contentType}' is unsupported`,
	{}
)

module.exports = {
	aBadRequest,
	anInternalServerError,
	anUnsupportedMediaType,
	aResponse
}
