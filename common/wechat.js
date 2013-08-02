/**
 * follow - common/wechat.js
 * Auth dead-horse <dead_horse@qq.com>
 */

"use strict";

/**
 * Module dependencies.
 */

var Pusher = require('pwechat');
var config = require('../config');

var pusher = Pusher.create(config.wechat.sender.email, config.wechat.sender.password);

function done(num, fn) {
  var called = false;
  return function (err) {
    if (called) {
      return;
    }
    if (err) {
      called = true;
      return fn(err);
    }
    num--;
    if (!num) {
      called = true;
      return fn.apply(null, arguments);
    }
  };
}

pusher.multiSend = function (idList, content, callback) {
  callback = done(idList.length, callback);
  var self = this;
  idList.forEach(function (id) {
    self.singleSend(id, content, callback);
  });
};

pusher.sendStock = function (idList, data, callback) {
  var type = data.SellBuy === '1' ? '卖出' : '买入';
  var content = '以 ' + data.DealPrice + type + data.StockCode + '。';
  content += '交易时间：' + data.DealTime + '。';
  content += '总共' + data.DealAmount + '股，' + Number(data.DealPrice) * Number(data.DealAmount) + '元。';
  if (type === '卖出') {
    content += '总计盈亏：' + data.profit + '元。';
  }
  pusher.multiSend(idList, content, callback);
};

module.exports = pusher;