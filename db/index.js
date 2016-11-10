/*jshint esversion: 6 */
'use strict';

const pg = require('pg');
const postgresUrl = 'postgres://localhost/Andres';
var client = new pg.Client(postgresUrl);

client.connect();

module.exports = client;
