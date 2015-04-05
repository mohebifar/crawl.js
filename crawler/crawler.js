var _ = require('lodash');
var casper = require('casper').create();

function Crawler(options) {
  var defaults = {};

  options = _.defaults(options, defaults);

  var Spooky = require('spooky');

  var spooky = new Spooky({
    child: {
      transport: 'http'
    },
    casper: {
      logLevel: 'debug',
      verbose: true
    }
  }, function (err) {
    if (err) {
      e = new Error('Failed to initialize SpookyJS');
      e.details = err;
      throw e;
    }

    spooky.start(
      'http://en.wikipedia.org/wiki/Spooky_the_Tuff_Little_Ghost');
    spooky.then(function () {
      this.emit('hello', 'Hello, from ' + this.evaluate(function () {
        return document.title;
      }));
    });
    spooky.run();
  });
}

Crawler.prototype.run = function () {

};