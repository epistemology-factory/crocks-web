"use strict";

const stream = require("stream");

class CollectingStream extends stream.Writable {
	constructor() {
		super({
			objectMode: true
		})

		this.data = []
	}

	_write(chunk, encoding, next) {
		this.data.push(chunk);

		next()
	}
}

module.exports = CollectingStream
