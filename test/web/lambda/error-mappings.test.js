"use strict";

const { converge, identity } = require("crocks");

const { assertThat, is } = require("hamjest");

const { internalServerError } = require("../../../src/web/lambda/responses");
const {
	mapError,
	mapInvalidContentType,
	mapValidationError
} = require("../../../src/web/lambda/error-mappings");
const { invalidContentType, validationError } = require("../../../src/web/lambda/errors");
const { validationFailure } = require("../../../src/validation/validation-failure");

const {
	aBadRequest,
	anInternalServerError,
	anUnsupportedMediaType
} = require("../../../src/test/hamjest/lambda/matchers/response");
const { CONSTRAINTS, DEFAULT_MESSAGES } = require("../../../src/validation/validators");

describe("errors", function() {
	describe("mapping errors", function() {
		const type = "is-bad";

		function isBadError() {
			return {
				type: type,
				message: "something bad happened"
			}
		}

		const mappings = {
			[type]: (obj) =>
				converge(
					internalServerError({}),
					({ message }) => message,
					identity
				)(obj)
		}

		it(`should map an error`, function() {
			const error = isBadError();
			const result = mapError(mappings, error)

			assertThat(result, is(anInternalServerError({}, "something bad happened", error)));
		});

		it(`should map unknown error type`, function() {
			const error = { type: "an-error" }
			const result = mapError(mappings, error)

			assertThat(result, is(anInternalServerError({}, `Unknown error type 'an-error'`, error)))
		});

		it("should map undefined error type", function() {
			const error = { errno: "an-error" }
			const result = mapError(mappings, error)

			assertThat(result, is(anInternalServerError({}, `System error`, error)))
		});
	});

	describe("invalid content type", function() {
		const headers = { "x-result": true };
		const contentType = "text/plain";
		const error = invalidContentType(contentType);

		it("should map invalid content type error", function() {
			const resp = mapInvalidContentType(headers, error)

			assertThat(resp, is(anUnsupportedMediaType(headers, contentType)))
		});
	});

	describe("invalid input", function() {
		const headers = { "x-result": true };
		const failure = validationFailure(
			CONSTRAINTS.IS_DEFINED,
			DEFAULT_MESSAGES[CONSTRAINTS.IS_DEFINED],
			[ "a", "b" ],
			null
		);

		const error = validationError([ failure ]);

		it("should map validation error", function() {
			const resp = mapValidationError(headers, error);

			assertThat(resp, is(aBadRequest(headers, "Invalid input", [
				{
					path: "a.b",
					constraints: {
						[CONSTRAINTS.IS_DEFINED]: DEFAULT_MESSAGES[CONSTRAINTS.IS_DEFINED]
					}
				}
			])))
		})
	});
});
