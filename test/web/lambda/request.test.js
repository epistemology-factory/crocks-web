"use strict";

const { identity, unsetPath } = require("crocks");

const { assertThat, is, allOf, hasSize, hasItem } = require("hamjest");

const { throwContents } = require("@epistemology-factory/crocks-ext/utils");

const { isDefined } = require("../../../src/validation/validators/common");
const { isSchemaValid } = require("../../../src/validation/validators");
const { isString } = require("../../../src/validation/validators/strings");
const { validateRequest } = require("../../../src/web/lambda/request");
const { validators } = require("../../../src/validation/validators/validator");

const { aValidationError } = require("../../../src/test/hamjest/lambda/matchers/errors");
const { aValidationFailure } =
	require("../../../src/test/hamjest/lambda/matchers/validation-failure");
const { CONSTRAINTS, DEFAULT_MESSAGES } = require("../../../src/validation/validators");

describe("request", function() {
	describe("validateRequest", function() {
		const request = {
			body: {
				message: "Hello World"
			}
		}

		const schema = {
			body: isSchemaValid({
				message: validators(isDefined, isString)
			})
		};

		it("should return validation error when schema validation fails", function() {
			const path = [ "body", "message" ];
			const input = unsetPath(path, request);

			const result = validateRequest(schema)(input).either(identity, throwContents)

			assertThat(result, is(aValidationError(
				allOf(
					hasSize(1),
					hasItem(aValidationFailure(
						path,
						CONSTRAINTS.IS_DEFINED,
						DEFAULT_MESSAGES[CONSTRAINTS.IS_DEFINED],
						undefined
					)))
				)
			));
		})
	});
});
