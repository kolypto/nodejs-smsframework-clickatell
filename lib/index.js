'use strict';

/** Clickatell Provider implementation
 * Based on HTTP API Specification v2.5.3: http://www.clickatell.com/downloads/http/Clickatell_HTTP.pdf
 *
 * @module
 */

exports.ClickatellProvider = require('./provider').ClickatellProvider;
exports.errors = require('./errors');
exports.defs = require('./defs');



// Register
require('smsframework').registerProvider(
	'clickatell',
	exports.ClickatellProvider
);
