'use strict';

var smsfw = require('smsframework'),
    perror = require('perror')
    ;

/** Clickatell errors
 * @fileOverview
 */

exports.E001 = perror(  1, 'E001', 'Authentication failed', smsfw.errors.AuthError);
exports.E002 = perror(  2, 'E002', 'Unknown username or password', smsfw.errors.AuthError);
exports.E003 = perror(  3, 'E003', 'Session ID expired', smsfw.errors.GenericError);
exports.E005 = perror(  5, 'E005', 'Missing session ID', smsfw.errors.GenericError);
exports.E007 = perror(  7, 'E007', 'IP Lockdown violation', smsfw.errors.AuthError);
exports.E101 = perror(101, 'E101', 'Invalid or missing parameters', smsfw.errors.RequestError);
exports.E102 = perror(102, 'E102', 'Invalid user data header', smsfw.errors.RequestError);
exports.E103 = perror(103, 'E103', 'Unknown API message ID', smsfw.errors.RequestError);
exports.E104 = perror(104, 'E104', 'Unknown client message ID', smsfw.errors.RequestError);
exports.E105 = perror(105, 'E105', 'Invalid destination address', smsfw.errors.RequestError);
exports.E106 = perror(106, 'E106', 'Invalid source address', smsfw.errors.RequestError);
exports.E107 = perror(107, 'E107', 'Empty message', smsfw.errors.RequestError);
exports.E108 = perror(108, 'E108', 'Invalid or missing API ID', smsfw.errors.RequestError);
exports.E109 = perror(109, 'E109', 'Missing message ID', smsfw.errors.RequestError);
exports.E113 = perror(113, 'E113', 'Maximum message parts exceeded', smsfw.errors.RequestError);
exports.E114 = perror(114, 'E114', 'Cannot route message', smsfw.errors.ServerError);
exports.E115 = perror(115, 'E115', 'Message expired', smsfw.errors.GenericError);
exports.E116 = perror(116, 'E116', 'Invalid Unicode data', smsfw.errors.RequestError);
exports.E120 = perror(120, 'E120', 'Invalid delivery time', smsfw.errors.RequestError);
exports.E121 = perror(121, 'E121', 'Destination mobile number blocked', smsfw.errors.GenericError);
exports.E122 = perror(122, 'E122', 'Destination mobile opted out', smsfw.errors.GenericError);
exports.E123 = perror(123, 'E123', 'Invalid Sender ID', smsfw.errors.RequestError);
exports.E128 = perror(128, 'E128', 'Number delisted', smsfw.errors.GenericError);
exports.E130 = perror(130, 'E130', 'Maximum MT limit exceeded until <UNIX TIME STAMP>', smsfw.errors.LimitsError);
exports.E201 = perror(201, 'E201', 'Invalid batch ID', smsfw.errors.RequestError);
exports.E202 = perror(202, 'E202', 'No batch template', smsfw.errors.RequestError);
exports.E301 = perror(301, 'E301', 'No credit left', smsfw.errors.CreditError);
exports.E901 = perror(901, 'E901', 'Internal error', smsfw.errors.ServerError);

exports.E = new perror.Lookup(exports);
