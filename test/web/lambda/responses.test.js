"use strict";

const { identity } = require("crocks");

const { assertThat, is } = require("hamjest");

const { respondWith, response, responseFrom } = require("../../../src/web/lambda/responses");

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

	it("should set response from object", function() {
		const data = {
			statusCode: 200,
			headers: { "x-header": "value" },
			body: { a: 1 }
		}

		const result = responseFrom(data)

		assertThat(result.statusCode, is(data.statusCode));
		assertThat(result.headers, is(data.headers));
		assertThat(result.body, is(JSON.stringify(data.body)));
	});
});
