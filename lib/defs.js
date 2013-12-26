'use strict';

var smsfw = require('smsframework'),
    perror = require('perror') // smsframework dependency
    ;

/** Clickatell definitions
 * @fileOverview
 */

/** Status codes and messages
 * @type {Object.<String, String>}
 */
exports.status_codes = {
     1: { status: 'UNK',        statusText: 'Message unknown' },
     2: { status: 'SENDING',    statusText: 'Message queued' },
     3: { status: 'SENDING',    statusText: 'Delivered to gateway' },
     4: { status: 'SENT',       statusText: 'Received by recipient' },
     5: { status: 'ERR',        statusText: 'Error with message' },
     6: { status: 'ERR',        statusText: 'User cancelled message delivery' },
     7: { status: 'ERR',        statusText: 'Error delivering message' },
     8: { status: 'OK',         statusText: 'OK' },
     9: { status: 'ERR',        statusText: 'Routing error' },
    10: { status: 'EXPIRED',    statusText: 'Message expired' },
    11: { status: 'SENDING',    statusText: 'Message queued for later delivery' },
    12: { status: 'ERR',        statusText: 'Out of credit' },
    14: { status: 'ERR',        statusText: 'Maximum MT limit exceeded' }
};

/** Message features
 * @type {Object.<String, Number}}
 */
exports.features = {
    FEAT_TEXT:      1,      // Text – set by default.
    FEAT_8BIT:      2,      // 8-bit messaging – set by default.
    FEAT_UDH:       4,      // UDH (Binary) - set by default.
    FEAT_UCS2:      8,      // UCS2 / Unicode – set by default.
    FEAT_ALPHA:     16,     // Alpha source address (from parameter).
    FEAT_NUMER:     32,     // Numeric source address (from parameter).
    FEAT_FLASH:     512,    // Flash messaging.
    FEAT_DELIVACK:  8192,   // Delivery acknowledgments.
    FEAT_CONCAT:    16384   // Concatenation – set by default.
};
