"use strict";

const identity = require("crocks/combinators/identity");

const { throwContents, throwResult } = require("@epistemology-factory/crocks-ext/utils");

const { CONSTRAINTS, DEFAULT_MESSAGES, isString } = require("../../../src/validation/validators");
const { isSchemaValid } = require("../../../src/validation/validators/object");

const {
	allOf,
	array,
	assertThat,
	equalTo,
	hasItems,
	hasProperty,
	hasSize,
	is
} = require("hamjest");

describe("object validators", function() {
	describe("isSchemaValid", function() {
		const schema = {
			name: isString,
			address: isSchemaValid({
				street: isString,
				suburb: isString
			})
		}

		it("should return input when validation success", function() {
			const input = {
				name: "Bruce Wayne",
				address: {
					street: "Wayne Drive",
					suburb: "Wayne Manor"
				}
			}

			const result = isSchemaValid(schema, [], input).either(throwContents, identity);

			assertThat(result, is(input));
		});

		it("should return error when validation fails", function() {
			const input = {
				address: {
					street: "Wayne Drive",
					suburb: "Wayne Manor"
				}
			}

			const result = isSchemaValid(schema, [], input).either(identity, throwResult);

			assertThat(result, is(arrayOf(validationError([ "name" ]))));
		});

		it("should prepend parent prop to validation error path for nested objects", function() {
			const input = {
				name: "Bruce Wayne",
				address: {
					suburb: "Wayne Manor"
				}
			}

			const result = isSchemaValid(schema, [], input).either(identity, throwResult);

			assertThat(result, is(arrayOf(validationError([ "address", "street" ]))));
		});

		it("should return flat list of validation errors", function() {
			const input = {
				address: {
					suburb: "Wayne Manor"
				}
			}

			const result = isSchemaValid(schema, [], input).either(identity, throwResult);

			assertThat(result, is(arrayOf(
				validationError([ "name" ]),
				validationError([ "address", "street" ])
			)));
		});
	});

	function arrayOf(...matchers) {
		return allOf(
			array(),
			hasSize(matchers.length),
			hasItems(...matchers)
		)
	}
	function validationError(path) {
		return allOf(
			hasProperty("path", equalTo(path)),
			hasProperty("constraints", equalTo({
				[CONSTRAINTS.IS_STRING]: DEFAULT_MESSAGES[CONSTRAINTS.IS_STRING]
			}))
		)
	}
});
