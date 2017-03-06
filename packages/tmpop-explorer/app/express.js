var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/build'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(4000, function() {
  console.log('Listening on :' + this.address().port);
});
