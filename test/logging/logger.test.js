"use strict";

const { Transform } = require("stream");

const Result = require("crocks/Result");
const { identity } = require("crocks/combinators");

const { assertThat, is } = require("hamjest");

const { LOG_LEVELS, LogLineStream, kliesliLog, log } = require("../../src/logging/logger");
const { throwContents } = require("@epistemology-factory/crocks-ext/utils");

class CollectingStream extends Transform {
	constructor() {
		super({
			encoding: "utf8",
			defaultEncoding: "utf8"
		});

		this.data = "";
	}

	_transform(chunk, encoding, callback) {
		this.data += chunk.toString()

		callback();
	}

	_flush(callback) {
		this.push(this.data);

		callback();
	}
}

describe("logger", function() {
	const error = {
		type: "an-error"
	}

	let dest;
	let data;
	let logger;

	beforeEach(function() {
		data = new CollectingStream();
		dest = new LogLineStream();

		dest.pipe(data);

		logger = log(dest, LOG_LEVELS.INFO);
	});

	describe("log", function() {
		it("should log to stream", async function() {
			process.nextTick(() => logger(LOG_LEVELS.ERROR, "Error occurred %O", error));

			const message = await waitForMessage();

			assertThat(message, is(`[ERROR]: Error occurred { type: 'an-error' }\n`));
		});

		it("shouldn't log if target level lower than desired level", async function() {
			process.nextTick(() => logger(LOG_LEVELS.DEBUG, "Debug %O")(error));

			const message = await waitForMessage();

			assertThat(message, is(""));
		});

		it("should return data to logger", async function() {
			let result;
			process.nextTick(() => result = logger(LOG_LEVELS.ERROR, "Error occurred %O")(error));

			await waitForMessage();

			assertThat(result, is(error));
		});
	});

	describe("kliesli log", function() {
		let loggerK

		beforeEach(function() {
			loggerK = kliesliLog(Result.Ok, logger);
		});

		it("should log and wrap in Result", async function() {
			let result
			process.nextTick(() => result = loggerK(LOG_LEVELS.ERROR)("Error occurred %O")(error));

			await waitForMessage();

			result = result.either(throwContents, identity)

			assertThat(result, is(error));
		});
	});

	function waitForMessage() {
		process.nextTick(() => dest.end());

		return new Promise((resolve) => {
			const onEnd = () => resolve("")

			data.once("data", (chunk) => {
				data.off("end", onEnd)

				resolve(chunk);
			});

			data.once("end", onEnd)
		});
	}
});
