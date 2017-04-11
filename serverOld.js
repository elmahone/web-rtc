'use strict';
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const app = express();

app.use(express.static('public'));

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const options = {
    key: sslkey,
    cert: sslcert,
};

https.createServer(options, app).listen(8080);
http.createServer((req, res) => {
    res.writeHead(301, {'Location': 'https://localhost:8080' + req.url});
    res.end();
}).listen(3000);

app.get('/', (req, res) => {
    res.redirect('/videochat.html');
});
