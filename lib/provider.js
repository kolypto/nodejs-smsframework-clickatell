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
    // Check config
    if (!config.api_id || !config.user || !config.pass)
        throw new Error('ClickatellProvider: Config fields missing: api_id, user, pass');

    // API Client
    this.api = new provider.api.ClickatellHttpApi(
        config.api_id, config.user, config.pass,
        _.omit(config, 'api_id', 'user', 'pass')
    );

    // Message Receiver
    webapp.all('/im', function(req, res){
        /* api_id: Api ID
         * moMsgId: MO message ID
         * from: Originating ISDN
         * to: Destination ISDN
         * timestamp: Date & Time in MySQL format, GMT+0200: "2008-08-06 09:43:50"
         * charset: DCS Character Coding [when applicable]
         * udh: Header Data [e.g. UDH etc.] [when applicable]
         * text: Message Data
         */

        // Input
        var data = req.method === 'POST' ? req.body : req.query,
            im = new smsfw.data.IncomingMessage(
                alias,
                new Date(data.timestamp + ' GMT+0200'),
                data.from,
                data.to,
                data.text
            );
        im.msgid = data.moMsgId;
        im.info = data;

        // Receive it
        gateway.handleIncomingMessage(im)
            // Response: no protocol, just the code
            .then(function(){ res.send(200, 'OK'); })
            .catch(function(err){ res.json(500, 'ERR: ' + err.message); });
    });

    // Status Receiver
    webapp.all('/status', function(req, res){
        /* from: source number
         * to: destination number
         * status: status code
         * cliMsgId: client-specified msgid (if provided)
         * api_id: API id
         * moMsgId: msgid
         * charge: charged credits
         */

        // Input
        var data = req.method === 'POST' ? req.body : req.query,
            status = new smsfw.data.MessageStatus(alias, data.moMsgId);

        data.status = parseInt(data.status);
        var s = provider.defs.status_codes[data.status];
        if (!s)
            status.setStatus('UNK', 'Unknown status code #'+data.status);
        else
            status.setStatus(s.status, s.statusText);
        status.info = data;

        // Bad errors
        switch (data.status){
            case 12: gateway.handleError(new smsfw.errors.CreditError(data.statusText)); break;
            case 14: gateway.handleError(new smsfw.errors.LimitsError(data.statusText)); break;
        }

        // Receive it
        gateway.handleMessageStatus(status)
            // Response: no protocol, just the code
            .then(function(){ res.send(200, 'OK'); })
            .catch(function(err){ res.json(500, 'ERR: ' + err.message); });
    });
};



//region Public API

/** Query balance
 * @returns {Q} promise for a Number
 */
ClickatellProvider.prototype.getBalance = function(){
    return this.api.getbalance()
        .then(function(response){
            return response.credit;
        });
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
