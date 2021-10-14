"use strict";

const assign = require("crocks/helpers/assign");
const reduce = require("crocks/pointfree/reduce");

const defaultCorsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent"
}

/**
 * Merges header objects together. The first value for a given key is preserved, so
 * order of input matters.
 */
// mergeHeaders :: ...Object -> Object
const mergeHeaders = (...headers) => reduce(assign, {}, headers)

module.exports = {
	defaultCorsHeaders,
	mergeHeaders
}
