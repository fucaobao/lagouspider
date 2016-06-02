var http = require('http');
var request = require('request');
var Q = require('q');
var eventproxy = require('eventproxy');
var moment = require('moment'); //时间包http://momentjs.com/docs/
var ep = new eventproxy();
var logger = require('./lib/log');
var lagou = require('./models/dao');
main();

function main() {
    lagou.distinct('city').then(function(doc) {
        var int = 0;
        for (var key in doc) {
            int += 1;
            console.log(doc[key]);
        }
        console.log(int);
    });
}