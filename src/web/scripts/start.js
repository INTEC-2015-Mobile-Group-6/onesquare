/**
 * bin/start.js
 * Web server script.
 *
 * @author Francis Brito <fr.br94@gmail.com>
 * @license ISC
 */
'use strict';

var app = require('../').app;

var PORT = process.env.NODE_PORT || 3000;

app.listen(PORT);

console.log('Listening at http://localhost:' + PORT);
