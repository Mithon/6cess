'use strict';

var express = require('express');
var http = require('http').Server(app);
var app = express();

app.use(express.static('public'));

app.listen(80, function() {
    console.log("App listening on port 80");
});
