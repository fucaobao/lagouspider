var http = require('http');
var request = require('request');
var eventproxy = require('eventproxy');
var moment = require('moment'); //时间包http://momentjs.com/docs/
var ep = new eventproxy();
var logger = require('./lib/log');
var lagou = require('./models/dao');

//相关参数
var reqUrl = 'http://www.lagou.com/jobs/positionAjax.json';
var argv = process.argv;
var reqParams = getArgs();
var count = 0;//执行次数
var currentTime = 0;
var nextTime = 0;

main();
function main() {
    if (argv.indexOf('-c') === -1 && argv.indexOf('-p') === -1) {
        console.log([
            'WARNING',
            'usage: node [city] [position]',
            '',
            'options:',
            '  -c city       城市(默认为"全国")',
            '  -p position   岗位名称(无默认值)'
        ].join('\n'));
    }
    setInterval(function() {
        nextTime = Date.now();
        if(count){
            logger.info('次数：%s，该次循环花费时间%s秒。', count, (nextTime - currentTime) / 1000);
        }
        currentTime = nextTime;
        getRequest(reqParams, function(body) {
            var maxPN = getMaxPN(body);
            maintask(maxPN);
        });
    }, 1000 * 60);
}

function maintask(maxPN) {
    for (var i = 0; i < maxPN; i++) {
        reqParams.pn = i + 1;
        if (i > 0) {
            reqParams.first = false;
        }
        getRequest(reqParams, function(body) {
            var json = JSON.parse(body);
            json.content.positionResult.result.forEach(function(item, index) {
                item.companyLogo = 'http://www.lagou.com/' + item.companyLogo;
                //有则不变，没有则增加
                lagou.findOneAndUpdate(item, function(err, doc) {
                    // 完成则触发upsert事件
                    ep.emit('upsert');
                });
            });
        });
    }
    // 如果upsert事件触发了maxPN次，则提示出来
    ep.after('upsert', maxPN, function(value) {
        count += 1;
    });
}

function getRequest(params, cb) {
    request.post({
        url: reqUrl,
        form: params
    }, function(err, httpResponse, body) {
        if (err) {
            logger.error(err);
            throw new Error(err);
        }
        typeof cb === 'function' && cb(body);
    });
}

function getMaxPN(value) {
    if (!value) {
        return 0;
    }
    var pageSize = 15; //拉勾网固定为15
    var maxPageNo = 30; //拉勾网最大分页为30
    var positionJSON = JSON.parse(value);
    var totalCount = positionJSON.content.positionResult.totalCount;
    return Math.min(Math.ceil(totalCount / pageSize), maxPageNo);
}

function getArgs() {
    var params = {
            needAddtionalResult: false,
            first: true,
            pn: 1
        };
    if (argv.indexOf('-c') === -1) {
        params.city = '全国';
    } else {
        params.city = argv[argv.indexOf('-c') + 1];
    }
    if (argv.indexOf('-p') === -1) {
        params.kd = '';
    } else {
        params.kd = argv[argv.indexOf('-p') + 1];
    }
    return params;
}