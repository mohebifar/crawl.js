var _ = require('lodash');
var Spooky = require('spooky');

function Crawler(url, options) {
  this.callback = [];

  var defaults = {
    url: url,
    spooky: {
      child: {
        transport: 'http'
      },
      casper: {
        logLevel: 'debug',
        verbose: true
      }
    }
  };

  options = _.defaults(options || {}, defaults);
  this.options = options;

  this.callback = [];

  var _this = this;

  var spooky = new Spooky(options.spooky, function (err) {
    if (err) {
      var e = new Error('Failed to initialize');
      e.details = err;
      throw e;
    }

    console.log('Ready to start, ' + options.url);

    spooky.start(options.url);

    for (var i = 0; i < _this.callback.length; i++) {
      var cb = _this.callback[i];
      cb(spooky);
    }

    spooky.run();
  });

  this.spooky = spooky;
}

Crawler.prototype.on = function (event, callback) {
  this.spooky.on(event, callback);

  return this;
};

Crawler.prototype.do = function (callback) {
  this.callback.push(callback);

  return this;
};

module.exports = Crawler;