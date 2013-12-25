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
    1: 'Message unknown',
    2: 'Message queued',
    3: 'Delivered to gateway',
    4: 'Received by recipient',
    5: 'Error with message',
    6: 'User cancelled message delivery',
    7: 'Error delivering message',
    8: 'OK',
    9: 'Routing error',
    10: 'Message expired',
    11: 'Message queued for later delivery',
    12: 'Out of credit',
    14: 'Maximum MT limit exceeded'
};
