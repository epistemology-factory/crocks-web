"use strict";

const { Async, Result, compose, constant, identity, objOf } = require("crocks");

const { assertThat, equalTo, hasProperty, is, instanceOf } = require("hamjest");

const { LOG_LEVELS, log } = require("../../../src/logging/logger");
const { assembler, handler, requestHandler } = require("../../../src/web/lambda/handler");

const { aLogMessage } = require("../../../src/test/hamjest/lambda/matchers/logger");
const CollectingStream = require("../../../src/test/collecting-stream");

describe("handlers", function() {
	const error = { type: "an-error" }

	let dest;
	let logger;

	beforeEach(function() {
		dest = new CollectingStream()
		logger = log(dest, LOG_LEVELS.DEBUG)
	});

	afterEach(function() {
		dest.end();
	});

	describe("handler", function() {
		it("should return success", async function() {
			const response = "success";
			const result = await handler(compose(Async.of, constant(response)))({});

			assertThat(result, is(response));
		});

		it("should return failure", async function() {
			const response = "failure";
			const result = await handler(compose(Async.Rejected, constant(response)))({});

			assertThat(result, is(response));
		});
	});

	describe("assembler", function() {
		const errFactory = () => Result.Err(error)
		const okFactory = () => Result.Ok(() => Async.Resolved())

		it("should return error when unable to assemble handler", async function() {
			const handler = assembler(logger, identity, errFactory, {});
			const result = await handler({ body: "abc" });

			assertThat(result, is(error));
		});

		it("should log error when unable to assemble handler", async function() {
			const handler = assembler(logger, identity, errFactory, {});
			await handler({ body: "abc" });

			assertThat(dest.data[0], is(
				aLogMessage(LOG_LEVELS.ERROR, `Can't assemble handler error={"type":"an-error"}`))
			);
		});

		it("should assemble handler", function() {
			const handler = assembler(logger, identity, okFactory, {});

			assertThat(handler, instanceOf(Function));
		});
	});

	describe("requestHandler", function() {
		const data = { message: "Hello World" };
		const errFactory = () => Async.Rejected(error)
		const okFactory = () => Async.Resolved(data)

		let factory;

		beforeEach(function() {
			factory = requestHandler(logger, objOf("result"), objOf("result"));
		});

		it("should log request", async function() {
			await factory(okFactory, {}).toPromise();

			assertThat(dest.data[0], is(aLogMessage(LOG_LEVELS.DEBUG, "request=")));
		});

		it("should log response", async function() {
			await factory(okFactory, {}).toPromise();

			assertThat(dest.data[1], is(aLogMessage(LOG_LEVELS.DEBUG, "response=")));
		});

		it("should log error", async function() {
			await factory(errFactory, {}).toPromise();

			assertThat(dest.data[1], is(aLogMessage(LOG_LEVELS.ERROR, "Error processing request error=")));
		});

		it("should transform error", async function() {
			const result = await factory(errFactory, {}).toPromise();

			assertThat(result, hasProperty("result", equalTo(error)));
		});

		it("should transform success", async function() {
			const result = await factory(okFactory, {}).toPromise();

			assertThat(result, hasProperty("result", equalTo(data)));
		});
	});
});
