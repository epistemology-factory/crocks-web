"use strict";

const { identity } = require("crocks");

const { allOf, assertThat, equalTo, hasProperty, instanceOf, is, throws } = require("hamjest");

const {
	getHeader,
	getHeaderOr,
	getHeaderOrErr,
	mergeHeaders
} = require("../../../src/web/lambda/headers");
const { throwContents } = require("@epistemology-factory/crocks-ext/utils");

describe("headers", function() {
	describe("mergeHeaders", function() {
		it("should merge headers", function() {
			assertThat(mergeHeaders({ a: 1}, { b: 2 }), is({ a: 1, b: 2 }));
		});

		it("should preserve first header given", function() {
			assertThat(mergeHeaders({ a: 1}, { a: 2 }), is({ a: 1 }));
		});
	});

	describe("getHeader", function() {
		const headers = {
			"origin": "http://localhost",
			"content-type": "text/plain"
		}

		it("should find header lowercased", function() {
			assertThat(get("origin"), is("http://localhost"));
			assertThat(get("content-type"), is("text/plain"));
		});

		it("should find header capitalized", function() {
			assertThat(get("Origin"), is("http://localhost"));
			assertThat(get("Content-Type"), is("text/plain"));
		});

		it("should return nothing when header not found", function() {
			assertThat(get("foo"), is(null));
		});

		function get(header) {
			return getHeader(header, headers).option(null)
		}
	});

	describe("getHeaderOr", function() {
		const defaultValue = "default";

		it("should return default if header not found", function() {
			assertThat(get("origin"), is(defaultValue));
		});

		function get(header) {
			return getHeaderOr(defaultValue, header, {})
		}
	});

	describe("getHeaderOrErr", function() {
		const missingHeader = (header) => new Error(`Missing ${header}`);

		it("should return error when header not found", function() {
			assertThat(() => get("origin"), throws(allOf(
				instanceOf(Error),
				hasProperty("message", equalTo("Missing origin"))
			)))
		})

		function get(header) {
			return getHeaderOrErr(missingHeader, header, {}).either(throwContents, identity);
		}
	});
});
