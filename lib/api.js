'use strict';

var perror = require('perror'),
    request = require('request'),
    Q = require('q'),
    _ = require('lodash')
    ;



/** Errors reported by the Clickatell API.
 * Data: { code: Number }
 * @constructor
 */
var ClickatellApiError = exports.ClickatellApiError = perror('ClickatellApiError');



/** Clickatell HTTP API Client
 *
 * @param {String} api_id
 *      Authentication: API ID
 * @param {String} username
 *      Authentication: username
 * @param {String} password
 *      Authentication: password
 *
 * @param {Object?} options
 * @param {Object?} [options.https=false]
 *      Use HTTPS protocol
 *
 * @constructor
 */
var ClickatellHttpApi = exports.ClickatellHttpApi = function(api_id, username, password, options){
    this.auth = {
        api_id: api_id,
        username: username,
        password: password
    };
    this.options = _.defaults(options || {}, {
        https: false,
        _hostname: 'api.clickatell.com' // Hidden option for testing: change hostname
    });
};

/** Make a custom request to Clickatell and get the response object
 * @param {String} method
 *      Method name
 * @param {Object?} params
 *      Parameters to send
 * @returns {Q} promise for a result object
 *      Clickatell API errors are reported as ClickatellApiError
 *      Other errors are returned as Error
 */
ClickatellHttpApi.prototype.apiRequest = function(method, params){
    var self = this;
    return Q.promise(function(resolve, reject, notify){
        // Prepare
        var options = {
            url: (self.options.https? 'https:' : 'http:') + '//'+ self.options._hostname +'/http/' + method,
            method: 'POST',
            form: _.extend(params || {}, {
                api_id: self.auth.api_id,
                user: self.auth.username,
                password: self.auth.password
            })
        };

        // Make the request
        request(options, function(err, res, body){
            if (err) // Error?
                reject(new Error(err+''));
            else {
                // Clickatell error?
                var error = /^ERR: (\d+), (.*)/.exec(body);
                if (error)
                    reject(new ClickatellApiError(error[2], { code: error[1] }));
                else
                    resolve(body); // success
            }
        });
    });
};

/** Query balance
 * This will return the number of credits available on this particular account.
 * @returns {Q} promise for { credit: Number }
 */
ClickatellHttpApi.prototype.getbalance = function(){
    return this.apiRequest('getbalance')
        .then(function(body){
            var r = /^Credit: ([\d\.]+)$/.exec(body);
            if (!r)
                throw new Error('Invalid response: ' + body);
            return {
                credit: +r[1]
            };
        });
};

/** No-op request
 * @returns {Q} promise
 */
ClickatellHttpApi.prototype.ping = function(){
    return this.apiRequest('ping');
};

/** Send SMS
 * @param {String} to
 *      Destination number
 * @param {String} text
 *      Message text
 * @param {Object?} params
 *      Message parameters. See Clickatell docs.
 * @param {String} [params.from='']
 *      Sender address: SenderID or one of the outgoing phone numbers
 * @param {Number} [params.deliv_ack=0]
 *      Enable/disable delivery acknowledgements. 0|1.
 * @param {String?} params.callback
 *      Callback URL for status reports. Receives data with HTTP GET
 * @param {Number?} params.deliv_time
 *      SMS delivery delay in minutes
 * @param {Number} [params.escalate=0]
 *      High-pri message: can potentially choose pricier gateways but deliver faster. 0|1.
 * @param {Number} [params.mo=0]
 *      Enable the ability to reply. 0|1.
 * @param {Number} [params.unicode=0]
 *      Enable unicode messages.
 *      If set to 1, the `text` should contain 2-byte unicode.
 * @param {Number?} [params.validity=1440]
 *      Message validity (expire) period in minutes
 *
 * @returns {Q} promise for { msgid: String }
 */
ClickatellHttpApi.prototype.sendmsg = function(to, text, params){
    // TODO: Clickatell allows to specify multiple recipients, ','-separated. Implement it! ..and handle the responses

    // Arguments
    params = params || {};
    to = to.replace(/^\+/, ''); // remove leading +
    // TODO: text encoding

    // Param: `concat`: enable message concatenation.
    params.concat = (function(len){
        // Message length: 160 7bit chars || 140 8bit chars
        // Note: concatenation reduces each message by 7 chars
        return (len <= 140)? 1 : Math.ceil(len/(140-7));
    })( new Buffer(text, "utf8").length );
    if (params.concat <= 1)
        delete params.concat;

    // CHECKME: seems like req_feat requires FEAT_DELIVACK to be set for acknowledgements. Implement!

    // TODO: detect unicode, set `unicode=1` and encode to 2-byte unicode HEX

    // Request
    return this.apiRequest('sendmsg', _.extend(params, { to: to, text: text }))
        .then(function(body){
            var r = /^ID: (.*)$/.exec(body);
            if (!r)
                throw new Error('Invalid response: ' + body);
            return {
                msgid: r[1]
            };
        });
};
