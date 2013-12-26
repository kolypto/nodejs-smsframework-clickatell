'use strict';

var express = require('express'),
    Q = require('q'),
    _ = require('lodash'),
    smsfw = require('smsframework'),
    provider = require('../')
    ;

/** Clickatell API simulator
 * @returns {express}
 */
var clickatellApiSimulator = exports.clickatellApiSimulator = function(){
    var app = express();
    app.use(express.bodyParser());

    var authenticate = function(data, res){
        if (data.user && data.password === '123')
            return true;
        else
            res.send(200, 'ERR: 002, Unknown username or password');
    };

    // getbalance
    app.all('/http/getbalance', function(req, res){
        var data = req.method === 'POST' ? req.body : req.query;
        if (authenticate(data, res))
            res.send(200, 'Credit: 12.50');
    });

    // sendmsg
    app.all('/http/sendmsg', function(req, res){
        var data = req.method === 'POST' ? req.body : req.query;
        if (authenticate(data, res)){
            // Check
            Q.fcall(function(){
                if (!data.to)
                    throw new provider.errors.E105();
                if (!data.text || !data.text.length)
                    throw new provider.errors.E107();
                if (!data.api_id)
                    throw new provider.errors.E108();

                // Okay, message sent
                return '9cdfb439c7876e703e307864c9167a15'; // msgid
            }).then(function(msgid){
                res.send(200, 'ID: '+msgid);
            }).catch(function(err){
                res.send(200, 'ERR: ' + err.code + ', ' + err.message);
            });
        }
    });

    return app;
};
