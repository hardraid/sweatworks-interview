// Initializations
const express = require('express'),
    app = express(),
    sqlite = require('sqlite3').verbose(),
    articleRoute = require('./article/article.route'),
    authorRoute = require('./author/author.route'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse application/json
app.use(bodyParser.json());

// Override with the X-HTTP-Method-Override header in the request
app.use(methodOverride());

app.use(express.static('public'));

// Article Route
app.use('/article', articleRoute);
// Author Route
app.use('/author', authorRoute);

// Error Handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.json({error: err.message ? err.message : 'Sorry, we are trying to solve some issues, please try again later.'});
});

// Listen port 3000
app.listen('3000', () => {
    console.log('Server Ready http://localhost:3000');
});

// For testing
module.exports = app;