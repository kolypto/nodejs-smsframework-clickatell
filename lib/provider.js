'use strict';

var Q = require('q'),
    _ = require('lodash'),
    smsfw = require('smsframework'),
    provider = require('../')
    ;

/** Clickatell provider
 *
 * @param {Object} config
 * @param {Boolean} [config.https=false]
 *      Use HTTPS protocol for outgoing messages
 * @param {String} config.api_id
 *      Authentication: API ID
 * @param {String} config.user
 *      Authentication: username
 * @param {String} config.pass
 *      Authentication: password
 *
 * @property {ClickatellHttpApi} api
 *      Clickatell API client
 *
 * @constructor
 * @inherits {smsframework.IProvider}
 */
var ClickatellProvider = exports.ClickatellProvider = function(gateway, alias, config, webapp){
    if (!config.api_id || !config.user || !config.pass)
        throw new Error('ClickatellProvider: Config fields missing: api_id, user, pass');

    this.api = new provider.api.ClickatellHttpApi(
        config.api_id, config.user, config.pass,
        _.omit(config, 'api_id', 'user', 'pass')
    );
};



//region Public API

/** Query balance
 * @returns {Q} promise for a Number
 */
ClickatellProvider.prototype.getBalance = function(){
    return this.api.getbalance();
};

/** Ping the API and check authentication
 * @returns {Q} promise for success
 */
ClickatellProvider.prototype.ping = function(){
    return this.api.ping();
};

//endregion



ClickatellProvider.prototype.send = function(message){
    var params = {};

    // Message fields
    if (message.from)
        params.from = message.from;
    if (message.options.senderId)
        params.from = message.options.senderId;

    // Message options
    if (message.options.status_report)
        params.deliv_ack = 1;
    if (message.options.escalate)
        params.escalate = 1;
    if (message.options.allow_reply)
        params.mo = 1;
    if (message.options.expires)
        params.validity = message.options.expires;

    // Send
    return this.api.sendmsg(message.to, message.body, params)
        // Handle errors
        .catch(function(err){
            // Clickatell errors
            if (err instanceof provider.api.ClickatellApiError){
                throw provider.errors.E.code( err.data.code, err.message );
            }
            // Other errors
            else
                throw new smsfw.errors.GenericError(err);
        })
        // Handle result
        .then(function(response){
            message.msgid = response.msgid;
            return message;
        });
};
