'use strict';

var smsfw = require('smsframework')
    ;
require('../'); // register the provider

exports.testClickatell = function(test){
    var gw = new smsfw.Gateway();
    gw.addProvider('clickatell', 'main', {});

    test.done();
};
