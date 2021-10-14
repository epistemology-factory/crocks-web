"use strict";

const { assertThat, is } = require("hamjest");

const { mergeHeaders } = require("../../../src/web/lambda/headers");

describe("headers", function() {
	describe("mergeHeaders", function() {
		it("should merge headers", function() {
			assertThat(mergeHeaders({ a: 1}, { b: 2 }), is({ a: 1, b: 2 }));
		});

		it("should preserve first header given", function() {
			assertThat(mergeHeaders({ a: 1}, { a: 2 }), is({ a: 1 }));
		});
	});
});
