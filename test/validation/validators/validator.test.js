"use strict";

const { identity } = require("crocks");

const { assertThat, is } = require("hamjest");

const { isDefined } = require("../../../src/validation/validators/common");
const { isString } = require("../../../src/validation/validators/strings");
const { validators } = require("../../../src/validation/validators/validator");

const { throwContents, throwResult } = require("@epistemology-factory/crocks-ext/utils");
const { aValidationFailure } =
	require("../../../src/test/hamjest/lambda/matchers/validation-failure");
const { CONSTRAINTS, DEFAULT_MESSAGES } = require("../../../src/validation/validators");

describe("validator", function() {
	describe("validators", function() {
		const path = [ "a" ];
		const validator = validators(isDefined, isString)

		it("should return error when value is undefined", function() {
			const value = undefined;
			const result = validator(path)(value).either(identity, throwResult);

			assertThat(result, is(aValidationFailure(
				path,
				CONSTRAINTS.IS_DEFINED,
				DEFAULT_MESSAGES[CONSTRAINTS.IS_DEFINED],
				value
			)))
		});

		it("should return error when value is not string", function() {
			const value = 123;
			const result = validator(path)(value).either(identity, throwResult);

			assertThat(result, is(aValidationFailure(
				path,
				CONSTRAINTS.IS_STRING,
				DEFAULT_MESSAGES[CONSTRAINTS.IS_STRING],
				value
			)))
		});

		it("should return value", function() {
			const value = "foo";

			const result = validator(path)(value).either(throwContents, identity);

			assertThat(result, is(value));
		})
	});
});
