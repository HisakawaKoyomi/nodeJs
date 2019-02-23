/*var express = require('express');
var server = express();

server.listen(9218);
server.use('',function (req,res) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.write('demo');
    res.end();
});*/

let http = require('http');

http.createServer(function (req,res) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.write('demo');
    res.end()
}).listen(9218);
