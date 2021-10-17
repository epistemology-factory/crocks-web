"use strict";

const Async = require("crocks/Async");

const nAry = require("crocks/helpers/nAry");

// convertAWSError :: (String -> Object) -> Error -> Object
const convertAWSError = (fn) =>
	(err) => fn(err.message)

// sendCommand :: Client -> Command -> Async Error Response
const sendCommand = nAry(2, Async.fromPromise(
	(client, command) => client.send(command)
))

module.exports = {
	convertAWSError,
	sendCommand
}
