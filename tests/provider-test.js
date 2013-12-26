'use strict';

var Q = require('q'),
    _ = require('lodash'),
    smsfw = require('smsframework'),
    provider = require('../') // register the provider
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

    // TODO: unit-tests!

    test.done();
};
