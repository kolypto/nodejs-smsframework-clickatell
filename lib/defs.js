'use strict';

var smsfw = require('smsframework')
    ;

/** Clickatell definitions
 * @fileOverview
 */

/** Error codes and messages
 * @type {Object.<String, String>}
 */
exports.error_codes = {
    001: 'Authentication failed',
    002: 'Unknown username or password',
    003: 'Session ID expired',
    005: 'Missing session ID',
    007: 'IP Lockdown violation',
    101: 'Invalid or missing parameters',
    102: 'Invalid user data header',
    103: 'Unknown API message ID',
    104: 'Unknown client message ID',
    105: 'Invalid destination address',
    106: 'Invalid source address',
    107: 'Empty message',
    108: 'Invalid or missing API ID',
    109: 'Missing message ID',
    113: 'Maximum message parts exceeded',
    114: 'Cannot route message',
    115: 'Message expired',
    116: 'Invalid Unicode data',
    120: 'Invalid delivery time',
    121: 'Destination mobile number blocked',
    122: 'Destination mobile opted out',
    123: 'Invalid Sender ID',
    128: 'Number delisted',
    130: 'Maximum MT limit exceeded until <UNIX TIME STAMP>',
    201: 'Invalid batch ID',
    202: 'No batch template',
    301: 'No credit left',
    901: 'Internal error'
};

/** Status codes and messages
 * @type {Object.<String, String>}
 */
exports.status_codes = {
    001: 'Message unknown',
    002: 'Message queued',
    003: 'Delivered to gateway',
    004: 'Received by recipient',
    005: 'Error with message',
    006: 'User cancelled message delivery',
    007: 'Error delivering message',
    008: 'OK',
    009: 'Routing error',
    010: 'Message expired',
    011: 'Message queued for later delivery',
    012: 'Out of credit',
    014: 'Maximum MT limit exceeded'
};
