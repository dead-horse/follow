/**
 * follow - index.js
 * Auth dead-horse <dead_horse@qq.com>
 */

"use strict";

/**
 * Module dependencies.
 */

var config = require('./config');
var wechat = require('./common/wechat');
var mail = require('./common/mail');
var urllib = require('urllib');
var fs = require('fs');

function noop() {

}

var lastTrade = {};
try {
  lastTrade = require(config.cachePath);
} catch (err) {}

function checkTime() {
  var now = new Date();
  if (now.getDay() === 0 || now.getDay() === 6) {
    return false;
  }
  var hour = now.getHours();
  if (hour < 9) {
    return false;
  }
  if (hour > 16) {
    return false;
  }
  return true;
}

var requestTime = 0;
var work = false;

function SINAFINANCE13754599546396028(data) {
  data = data.data;
  var newstTrade = data[0];
  requestTime++;
  console.log('第%s次请求...', requestTime);

  if (newstTrade.DealTime !== lastTrade.DealTime) {
    wechat.sendStock(config.wechat.user, newstTrade, noop);
    mail.sendStock(config.mail.user, newstTrade, noop);
    lastTrade = newstTrade;
    fs.writeFileSync(config.cachePath, JSON.stringify(newstTrade));
    console.log('获取到新的交易记录');
  } else {
    console.log('暂无新的交易记录');
  }
}

function request() {
  if (!checkTime()) {
    work = false;
    return;
  }
  if (!work) {
    work = true;
    wechat.multiSend(config.wechat.user, '开始获取交易！');
  }
  urllib.request(config.url, function (err, data) {
    if (err) {
      if (err.message.indexOf('timeout') > 0) {
        return ;
      }
      return wechat.multiSend(config.wechat.user, '请求发生错误：' + err.message, noop);
    }
    eval(data.toString());
  });
}

setInterval(request, 10 * 1000);

fs.writeFileSync('server.pid', process.pid);
console.log('$$');
