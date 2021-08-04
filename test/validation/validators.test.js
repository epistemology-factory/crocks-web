"use strict";

const Result = require("crocks/Result");

const compose = require("crocks/helpers/compose");
const flip = require("crocks/combinators/flip");
const identity = require("crocks/combinators/identity");
const ifElse = require("crocks/logic/ifElse");

const { joinPair } = require("@epistemology-factory/crocks-ext/String");
const { throwError } = require("@epistemology-factory/crocks-ext/utils");

const { resultValidator } = require("../../src/validation/validators");
const { assertThat, is } = require("hamjest");

// isGreaterThan :: Number -> Number -> Boolean
const isGreaterThan = (a) => (b) => b > a

// concatWords = String -> String -> String
const concatWords = flip(joinPair(" "))

describe("validators", function() {
	describe("validator", function() {
		const validation =
			ifElse(
				isGreaterThan(5),
				Result.of,
				compose(Result.Err, concatWords("is not greater than 5"))
			)

		it("should return input when validation success", function() {
			const input = 10

			const result = resultValidator(validation, input).either(throwError, identity);

			assertThat(result, is(input));
		});

		it("should return error when validation fails", function() {
			const input = 2

			const result = resultValidator(validation, input).either(identity, throwError);

			assertThat(result, is("2 is not greater than 5"));
		});
	});
});
