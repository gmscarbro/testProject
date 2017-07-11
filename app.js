// Require statements
var express = require('express');
var emailLogic = require('./emailLogic.js');

// Creates server with express
var app = express();

// Call emailLogic controller function
emailLogic(app);

// Defines the port the server is listening to
app.listen(8080);