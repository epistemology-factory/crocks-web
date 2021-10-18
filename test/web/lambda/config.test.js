"use strict";

const { identity, setProp, unsetProp } = require("crocks");

const { getLogger } = require("../../../src/web/lambda/config");
const { LOG_LEVELS, LOG_LEVEL_STRINGS, log } = require("../../../src/logging/logger");

const { throwContents, throwResult } = require("@epistemology-factory/crocks-ext/utils");

const { assertThat, hasProperty, is } = require("hamjest");

const CollectingStream = require("../../../src/test/collecting-stream");
const { anInvalidEnvVar } = require("../../../src/test/hamjest/lambda/matchers/errors");
const { aLogMessage } = require("../../../src/test/hamjest/lambda/matchers/logger");

describe("config", function() {
	const env = {
		LOG_LEVEL: LOG_LEVEL_STRINGS[LOG_LEVELS.DEBUG]
	}

	describe("logger", function() {
		const message = "Hello World";

		let dest;
		let logger

		beforeEach(function() {
			dest = new CollectingStream();
			logger = log(dest);
		});

		afterEach(function() {
			dest.end();
		});

		it("should default to INFO if LOG_LEVEL missing", function() {
			logMessage(unsetProp("LOG_LEVEL", env));

			// Nothing should have been logged
			assertThat(dest.data, is([]));
		});

		it("should set log level when LOG_LEVEL present", function() {
			logMessage(env);

			assertThat(dest.data[0], is(aLogMessage(LOG_LEVELS.DEBUG, message)));
		});

		it("should return error if log level not valid", function() {
			const name = "LOG_LEVEL";
			const input = setProp(name, "foo", env);

			const result = getLogger(logger)(input).either(identity, throwContents);

			assertThat(result, is(anInvalidEnvVar(name)))
		});

		function logMessage(env) {
			const result = getLogger(logger)(env).either(throwResult, identity).valueOf();
			assertThat(result, hasProperty("logger"))

			result.logger(LOG_LEVELS.DEBUG, message, "");
		}
	});
});
