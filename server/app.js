(function() {
  'use strict';

  var express = require('express');
  var path = require('path');

  var app = express();
  var port = process.env.PORT || 3000;
  var rootDir = path.normalize(__dirname + '/..');

  app.use(express.static(rootDir + '/client'));


  console.log('app is listening on port ' + port);
  app.listen(port);


})();