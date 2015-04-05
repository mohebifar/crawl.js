var Crawler = require('./crawler/crawler');
var async = require('async');

var Sequelize = require('sequelize');


var sequelize = new Sequelize('robot', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

var Post = sequelize.define('post', {
  title: {
    type: Sequelize.STRING
  },
  body: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var crawlerMain = new Crawler('https://mohebifar.com/');

crawlerMain.do(function (connection) {

  connection.then(function () {

    var links = this.evaluate(function () {

      var links = [];
      $('body > div.container > div > div > article > h2 > a').each(function () {
        links.push('https://mohebifar.com/' + $(this).attr('href'));
      });

      return links;
    });

    this.emit('links', links);

  });

});

crawlerMain.on('links', function (links) {
  async.eachSeries(links, function (link, done) {

    console.log('Crawling ' + link);

    var crawlerPost = new Crawler(link);

    crawlerPost.do(function (connection) {

      connection.then(function () {

        var post = this.evaluate(function () {
          return {
            title: document.querySelector('body > div.container-fluid > div > div > h2 > a').textContent
          };
        });

        this.emit('data', post);

      });

    });

    crawlerPost.on('data', function (post) {
      console.log('Saving post');
      console.log(post);

      //Post.create(post);

      done();
    });

  }, function () {
    console.log('All done !');
  });

});