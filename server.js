'use strict';
const config = require('getconfig');
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const sockets = require('signal-master/sockets');
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

// modify this line:
const server = https.createServer(options, app).listen(8888);

app.get('/', (req, res) => {
    res.redirect('/videochat.html');
});

sockets(server, config);
