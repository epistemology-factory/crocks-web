"use strict";

const { Async, compose, constant, identity } = require("crocks");

const { assertThat, is } = require("hamjest");

const { handler } = require("../../../src/web/lambda/handler");

describe("handler", function() {
	const logger = () => identity

	it("should return success", async function() {
		const response = "success";
		const result = await handler(logger, compose(Async.of, constant(response)))({});

		assertThat(result, is(response));
	});

	it("should return failure", async function() {
		const response = "failure";
		const result = await handler(logger, compose(Async.Rejected, constant(response)))({});

		assertThat(result, is(response));
	});
});
