"use strict";

const { identity } = require("crocks");

const { assertThat, is } = require("hamjest");
const { throwContents, throwResult } = require("@epistemology-factory/crocks-ext/utils");

const {
	CONSTRAINTS,
	DEFAULT_MESSAGES,
	isBoolString
} = require("../../../src/validation/validators");
const {
	aValidationFailure
} = require("../../../src/test/hamjest/lambda/matchers/validation-failure");

describe("boolean", function() {
	describe("isBoolString", function() {
		const path = [ "a" ];
		const bools = [ "true", "false" ];

		it("should return error if not bool string", function() {
			const value = "adfad";
			const result = isBoolString(path, value).either(identity, throwResult);

			assertThat(result, is(aValidationFailure(
				path,
				CONSTRAINTS.IS_BOOL_STRING,
				DEFAULT_MESSAGES[CONSTRAINTS.IS_BOOL_STRING],
				value
			)));
		});

		bools.forEach((bool) =>
			it(`should return ok for '${bool}'`, function() {
				const result = isBoolString(path, bool).either(throwContents, identity)

				assertThat(result, is(bool));
			})
		);
	});
});
