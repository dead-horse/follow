/**
 * follow - config/index.js
 * Auth dead-horse <dead_horse@qq.com>
 */

"use strict";

/**
 * Module dependencies.
 */

var path = require('path');

var config = {
  url: 'http://stock.finance.sina.com.cn/match/api/jsonp.php/SINAFINANCE13754599546396028/Order_Service.getTransaction?uid=1567515287&count=10&from=0&days=0&sort=1&cid=1001',
  cachePath: path.join(__dirname, '..', '.stock_cache.json'),
  wechat: {

  },
  mail: {

  }
};

var customConfig = path.join(__dirname, 'config.js');
var options = {};

try {
  options = require(customConfig);
} catch (err) {
  if (err) {
    console.error('can not find custom config, use default config');
    process.exit(1);
  }
}

for (var key in options) {
  config[key] = options[key];
}

module.exports = config;
