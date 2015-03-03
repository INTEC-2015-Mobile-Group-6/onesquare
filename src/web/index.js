/**
 * index.js
 * OneSquare web application entry point.
 *
 * @author Francis Brito <fr.br94@gmail.com>
 * @license ISC
 */
'use strict';

var express = require('express'),
    path = require('path');

var app = express();

var PUBLIC_DIR = path.join(__dirname, 'public');

app.use('/', express.static(PUBLIC_DIR));

module.exports.app = app;
