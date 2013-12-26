[![Version](https://badge.fury.io/js/smsframework-clickatell.png)](https://npmjs.org/package/smsframework-clickatell)
[![Dependency Status](https://gemnasium.com/kolypto/nodejs-smsframework-clickatell.png)](https://gemnasium.com/kolypto/nodejs-smsframework-clickatell)
[![Build Status](https://travis-ci.org/kolypto/nodejs-smsframework-clickatell.png?branch=master)](https://travis-ci.org/kolypto/nodejs-smsframework-clickatell)

SMSframework Clickatell Provider
================================

[Clickatell](https://www.clickatell.com/) Provider for [SMSframework](https://npmjs.org/package/smsframework).

You need a "Developers' Central" Clickatell account with an HTTP API set up.
From the API, you need: api_id, username, password






Initialization
==============

```js
var gw = new smsframework.Gateway();
gw.addProvider('clickatell', 'main', { api_id: 1, user: 'kolypto', pass: '123', https: false });
```

Config
------
* `api_id: String`: API ID to use
* `user: String`: Account username
* `pass: String`: Account password
* `https: Boolean`: Use HTTPS for outgoing messages? Default: `false`






Sending Parameters
==================

* `deliv_time: Number`: Delay the delivery for X minutes






Receivers
=========

Message Receiver: /im
---------------------
After a number is purchased, go to Receive Messages > Manage long numbers / short codes, and then click the ‘Edit’
link of the two-way number which you would like to configure. Set "Reply Path" to "HTTP Get" | "HTTP Post",
in the field - put the message receiver URL.

* "Username & Password" is not supported
* "Secondary callback" is up to you

Message Receiver URL: `<alias>/im`

Status Receiver: /status
------------------------
To start getting status reports from Clickatell, edit the  HTTP API in the admin panel and click on
"Enable your app to receive message delivery notifications".
In the field, put the receiver URL.

* Status receiver only supports "HTTP Get" and "HTTP Post" methods.
* "basic HTTP Authentication" is not supported

Status Receiver URL: `<alias>/status`






Additional Information
======================

OutgoingMessage.info
--------------------
No special fields here.

IncomingMessage.info
--------------------
The following fields are available in `info`:

* `api_id: String`: API id
* `charset: String`: Message character set (when applicable)
* `udh: String`: Header Data (when applicable)

MessageStatus.info
------------------
* `status: Number`: Message status code
* `reference: String`: Reference string
* `api_id: String`: API id
* `charge: Number`: Charged funds






Notes
=====

