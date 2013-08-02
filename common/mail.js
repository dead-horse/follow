/**
 * follow - common/wechat.js
 * Auth dead-horse <dead_horse@qq.com>
 */

"use strict";

/**
 * Module dependencies.
 */

var nodemailer = require('nodemailer');
var config = require('../config');

exports.send = function (to, subject, html, callback) {
  callback = callback || function () {};

  var transport = nodemailer.createTransport("SMTP", config.mail.sender);

  var message = {
    sender: config.mail.sender.name,
    to: to,
    subject: subject,
    html: html,
  };

  transport.sendMail(message, function (err, result) {
    transport.close();
    callback(err, result);
  });
};

exports.sendStock = function (to, data, callback) {
  var type = data.SellBuy === '1' ? '卖出' : '买入';
  var subject = '以 ' + data.DealPrice + type + data.StockCode;
  var html = subject + '<br />';
  html += '交易时间：' + data.DealTime + '。<br />';
  html += '总共' + data.DealAmount + '股，' + Number(data.DealPrice) * Number(data.DealAmount) + '元。';
  if (type === '卖出') {
    html += '总计盈亏：' + data.profit + '元。';
  }
  exports.send(to, subject, html, callback);
};

