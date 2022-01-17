"use strict";

const { identity } = require("crocks");

const { assertThat, is } = require("hamjest");

const { throwResult, throwContents } = require("@epistemology-factory/crocks-ext/utils");

const {
	isDefined,
	isNotEmpty,
	CONSTRAINTS,
	DEFAULT_MESSAGES
} = require("../../../src/validation/validators");

const { aValidationFailure } = require(
	"../../../src/test/hamjest/lambda/matchers/validation-failure");

describe("common validators", function() {
	const path = [ "a" ]

	describe("isDefined", function() {
		it("should return error when not defined", function() {
			const value = undefined;
			const result = isDefined(path)(value).either(identity, throwResult)

			assertThat(result, is(aValidationFailure(
				path,
				CONSTRAINTS.IS_DEFINED,
				DEFAULT_MESSAGES[CONSTRAINTS.IS_DEFINED],
				value
			)));
		});

		it("should match defined value", function() {
			const value = "123";
			const result = isDefined(path)(value).either(throwContents, identity)

			assertThat(result, is(value));
		});
	});

	describe("isNotEmpty", function() {
		it("should return error when empty object", function() {
			validationFailureTest({});
		});

		it("should return error when empty array", function() {
			validationFailureTest([]);
		});

		it("should return error when empty string", function() {
			validationFailureTest("");
		});

		it("should match non empty value", function() {
			const value = "123";
			const result = isNotEmpty(path)(value).either(throwContents, identity)

			assertThat(result, is(value));
		});

		function validationFailureTest(value) {
			const result = isNotEmpty(path)(value).either(identity, throwResult)

			assertThat(result, is(aValidationFailure(
				path,
				CONSTRAINTS.IS_NOT_EMPTY,
				DEFAULT_MESSAGES[CONSTRAINTS.IS_NOT_EMPTY],
				value
			)));
		}
	});
});
