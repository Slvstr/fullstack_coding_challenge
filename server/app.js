(function() {
  'use strict';

  var express = require('express');
  var path = require('path');
  var Card = require('./cards.model');

  var app = express();
  var port = process.env.PORT || 3000;
  var rootDir = path.normalize(__dirname + '/..');

  app.use(express.static(rootDir + '/build'));

  app.get('/cards', function(req, res) {
    var cards = Card.findAll();
    res.json(cards);
  });


  console.log('app is listening on port ' + port);
  app.listen(port);


})();