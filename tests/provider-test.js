'use strict';

var request = require('request'),
    Q = require('q'),
    _ = require('lodash'),
    smsfw = require('smsframework'),
    provider = require('../'), // register the provider
    common = require('./common')
    ;

/** Test Provider
 * @param {test|deepEqual} test
 */
exports.testProvider = function(test){
    var gw = new smsfw.Gateway();
    gw.addProvider('clickatell', 'main', { api_id: 1, user: 'kolypto', pass: '123',  _hostname: 'localhost:80' });
    gw.addProvider('clickatell', 'err',  { api_id: 1, user: 'invalid', pass: 'zzz',  _hostname: 'localhost:80' });

    // Not enough config fields
    test.throws(function(){
        gw.addProvider('clickatell', 'main', {});
    }, Error);

    // Test
    var server, url;
    [
        // Test Provider API
        function(){
            var server;
            return smsfw.Gateway._listenExpress(common.clickatellApiSimulator(), [0, 'localhost'])
                .then(function(srv){
                    gw.addProvider('clickatell', 'sim', { api_id: 1, user: 'kolypto', pass: '123',  _hostname: 'localhost:'+srv.address().port });
                    server = srv;
                })
                // Test: getBalance
                .then(function(){
                    return gw.getProvider('sim').getBalance()
                        .then(function(balance){
                            test.strictEqual(balance, 12.50);
                        });
                })
                // Test: send message with error
                .then(function(){
                    return gw.message('+123', '').provider('sim').send() // empty message
                        .then(function(){ test.ok(false, 'Should never'); })
                        .catch(function(err){
                            test.ok(err instanceof smsfw.errors.RequestError, err.stack);
                        });
                })
                // Test: send message
                .then(function(){
                    return gw.message('+123', 'hi there').provider('sim').send()
                        .then(function(message){
                            test.ok(message instanceof smsfw.data.OutgoingMessage);
                            test.strictEqual(message.msgid, '9cdfb439c7876e703e307864c9167a15');
                        });
                })
                .finally(function(){ server && server.close(); })
                ;
        },
        // Test HTTP /im
        function(){
            var traffic = [];
            gw.on('msg-in', function(message){ traffic.push(message); });

            var qs = { api_id: 1, moMsgId: 'd41d8cd98f00b204e9800998ecf8427e', from: '+111', to: '+222', timestamp: '2013-12-31 23:59:59', text: 'hi there' };
            return Q.nfcall(request, {
                url: url + '/main/im',
                qs: qs
            }).spread(function(res, body){
                test.strictEqual(res.statusCode, 200);
            }).then(function(){
                test.equal(traffic.length, 1);
                test.deepEqual(traffic[0], {
                    from: '+111',
                    to: '+222',
                    body: 'hi there',
                    provider: 'main',
                    date: new Date('Tue Dec 31 2013 23:59:59 GMT+0200'),
                    msgid: 'd41d8cd98f00b204e9800998ecf8427e',
                    info: qs
                });
            });
        },
        // Test HTTP /status
        function(){
            var traffic = [];
            gw.on('status', function(message){ traffic.push(message); });

            var qs = { from: '+111', to: '+222', status: 4, api_id: 1, moMsgId: 'd41d8cd98f00b204e9800998ecf8427e', charge: 10 };
            return Q.nfcall(request, {
                url: url + '/main/status',
                qs: qs
            }).spread(function(res, body){
                    test.strictEqual(res.statusCode, 200);
                    test.strictEqual(body, 'OK');
                }).then(function(){
                    test.equal(traffic.length, 1);
                    test.deepEqual(traffic[0], {
                        provider: 'main',
                        msgid: 'd41d8cd98f00b204e9800998ecf8427e',
                        delivered: true,
                        error: undefined,
                        status: 'SENT',
                        statusText: 'Received by recipient',
                        info: qs
                    });
                });
        },
        // Test HTTP /status with 'No credits left' error
        function(){
            var errors = [];
            gw.on('error', function(err){ errors.push(err); });

            var qs = { from: '+111', to: '+222', status: 12, api_id: 1, moMsgId: 'd41d8cd98f00b204e9800998ecf8427e', charge: 10 };
            return Q.nfcall(request, {
                url: url + '/main/status',
                qs: qs
            }).spread(function(res, body){
                    test.strictEqual(res.statusCode, 200);
                    test.strictEqual(body, 'OK');
                }).then(function(){
                    test.equal(errors.length, 1);
                    test.ok(errors[0] instanceof smsfw.errors.CreditError);
                });
        }
    ].reduce(Q.when, gw.listen(0, 'localhost').then(function(srv){ server = srv; url = 'http://localhost:'+srv.address().port; }))
        .catch(function(err){ test.ok(false, err.stack); })
        .finally(function(){ test.done(); server && server.close(); });
};
