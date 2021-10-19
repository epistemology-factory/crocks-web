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

// aForbiddenResponse :: Object -> Matcher
const aForbiddenResponse = (headers) =>
	aResponse(403, headers, { message: "Forbidden" })

// anInternalServerError :: (Object, String, a) -> Matcher
const anInternalServerError = partial(anErrorResponse, 500)

// anUnauthorisedResponse :: Obejct -> Matcher
const anUnauthorisedResponse = (headers) =>
	aResponse(401, headers, { message: "Unauthorised" })

// anUnsupportedMediaType :: (Object, String) -> Matcher
const anUnsupportedMediaType = (headers, contentType) => anErrorResponse(
	415,
	headers,
	`'${contentType}' is unsupported`,
	{}
)

module.exports = {
	aBadRequest,
	aForbiddenResponse,
	anInternalServerError,
	anUnauthorisedResponse,
	anUnsupportedMediaType,
	aResponse
}
