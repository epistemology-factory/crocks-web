"use strict";

const { converge, identity } = require("crocks");

const { assertThat, is } = require("hamjest");

const { internalServerError } = require("../../../src/web/lambda/responses");
const { mapError } = require("../../../src/web/lambda/errors");
const { anInternalServerError } = require("./matchers/response");

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

	describe("validation errors", function() {

	});
});
