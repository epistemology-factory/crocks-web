"use strict";

const { identity } = require("crocks");

const { assertThat, is } = require("hamjest");

const { throwResult, throwContents } = require("@epistemology-factory/crocks-ext/utils");

const {
	isIntString,
	isISODate,
	CONSTRAINTS,
	DEFAULT_MESSAGES
} = require("../../../src/validation/validators");

const { aValidationFailure } = require(
	"../../../src/test/hamjest/lambda/matchers/validation-failure");

describe("string validators", function() {
	const path = [ "a" ]

	describe("isISODate", function() {
		it("should return error when string not ISO date", function() {
			const value = "dfdafas";
			const result = isISODate(path)(value).either(identity, throwResult)

			assertThat(result, is(aValidationFailure(
				path,
				CONSTRAINTS.IS_ISO_DATE,
				DEFAULT_MESSAGES[CONSTRAINTS.IS_ISO_DATE],
				value
			)));
		});

		it("should match ISO date", function() {
			const value = "2021-05-21";
			const result = isISODate(path)(value).either(throwContents, identity)

			assertThat(result, is(value));
		});
	});

	describe("isIntString", function() {
		it("should return error when not a int string", function() {
			const value = "dfdafas";
			const result = isIntString(path)(value).either(identity, throwResult)

			assertThat(result, is(aValidationFailure(
				path,
				CONSTRAINTS.IS_INT_STRING,
				DEFAULT_MESSAGES[CONSTRAINTS.IS_INT_STRING],
				value
			)));
		});

		it("should match int string", function() {
			const value = "123";
			const result = isIntString(path)(value).either(throwContents, identity)

			assertThat(result, is(value));
		});
	});
});
