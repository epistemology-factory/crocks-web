"use strict";

const { Result, identity, unsetPath } = require("crocks");

const {
	allOf,
	assertThat,
	hasItem,
	hasSize,
	is, equalTo
} = require("hamjest");

const { throwContents, throwResult } = require("@epistemology-factory/crocks-ext/utils");

const { isDefined } = require("../../../src/validation/validators/common");
const { isSchemaValid } = require("../../../src/validation/validators");
const { isString } = require("../../../src/validation/validators/strings");
const { parseBody, parseJSON, validateRequest } = require("../../../src/web/lambda/request");
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

	describe("parseBody", function() {
		const parse = () => () => Result.Ok({ a: 1 })

		it("should return error if body missing", async function() {
			const result = parseBody(parse, {}).either(identity, throwResult)

			assertThat(result, is(aValidationError(hasItem(aValidationFailure(
				[ "body" ],
				CONSTRAINTS.IS_DEFINED,
				DEFAULT_MESSAGES[CONSTRAINTS.IS_DEFINED],
				undefined
			)))));
		});

		it("should return error if body not parseable", async function() {
			const error = { type: "an-error" }
			const notParseable = () => () => Result.Err(error);

			const result = parseBody(notParseable, { body: "" }).either(identity, throwResult)

			assertThat(result, is(error));
		});

		it("should return body", async function() {
			const result = parseBody(parse, { body: "" }).either(throwContents, identity)

			assertThat(result, is({ a: 1 }));
		});
	});

	describe("parse json", function() {
		it("should return error if input not parseable", function() {
			const data = "fdasfasfadsf"
			const path = [ "body" ];

			const result = parseJSON(path, data).either(identity, throwResult)

			assertThat(result, is(aValidationError(hasItem(aValidationFailure(
				path,
				CONSTRAINTS.IS_JSON,
				DEFAULT_MESSAGES[CONSTRAINTS.IS_JSON],
				data
			)))));
		});

		it("should parse json input", function() {
			const data = { a: 1}
			const result = parseJSON([ "body" ], JSON.stringify(data)).either(throwContents, identity)

			assertThat(result, is(equalTo(data)));
		})
	});
});
