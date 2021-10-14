"use strict";

const { identity } = require("crocks");

const { assertThat, is } = require("hamjest");

const { invalidInput, respondWith, response } = require("../../../src/web/lambda/responses");
const { CONSTRAINTS, DEFAULT_MESSAGES } = require("../../../src/validation/validators");

const ok = response(200, { "x-result": "true" });

describe("response", function() {
	const resp = ok({ a: 1 });

	it("should add status code", function() {
		assertThat(resp.statusCode, is(200));
	});

	it("should add headers", function() {
		assertThat(resp.headers["x-result"], is("true"));
	});

	it("should set JSON body", function() {
		assertThat(resp.body, is(JSON.stringify({ a: 1 })));
		assertThat(ok([ "foo" ]).body, is(JSON.stringify([ "foo" ])));
	});

	it("should ignore no body", function() {
		const resp = response(200, { "x-result": "true" }, null);

		assertThat(resp.body, is("{}"));
	});

	it("should return response", async function() {
		const response = "success";

		const result = await respondWith(identity)(response).toPromise();

		assertThat(result, is(response));
	});

	describe("invalid input", function() {
		const headers = { "x-result": true };
		const constraints = {
			[CONSTRAINTS.IS_DEFINED]: DEFAULT_MESSAGES[CONSTRAINTS.IS_DEFINED]
		};
		const resp = invalidInput(headers, [
			{
				path: [ "a", "b" ],
				constraints,
				value: null
			}
		]);

		it("should have correct status code", function() {
			assertThat(resp.statusCode, is(400));
		});

		it("should have correct headers", function() {
			assertThat(resp.headers, is(headers));
		});

		it("should set message", function() {
			const body = parseBody();

			assertThat(body.message, is("Invalid input"));
		});

		it("should collapse validation path to string", function() {
			const body = parseBody();

			assertThat(body.cause[0].path, is("a.b"));
		});

		it("should pass through constrains", function() {
			const body = parseBody();

			assertThat(body.cause[0].constraints, is(constraints));
		});

		it("should not pass through value", function() {
			const body = parseBody();

			assertThat(body.cause[0].value, is(undefined));
		});

		function parseBody() {
			return JSON.parse(resp.body);
		}
	})
});
