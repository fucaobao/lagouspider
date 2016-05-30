var request = require('request');
var lagou = require('./models/dao.js');
var req_url = 'http://www.lagou.com/jobs/positionAjax.json';
main();

function main() {
    getRequest(getArgs(), function(body) {
        var maxPN = getMaxPN(body);
        maintask(maxPN);
    });
}

function maintask(maxPN) {
    var params = getArgs();
    for (var i = 0; i < maxPN; i++) {
        params.pn = i + 1;
        if (i > 0) {
            params.first = false;
        }
        getRequest(params, function(body) {
            var json = JSON.parse(body);
            json.content.positionResult.result.forEach(function(item, index) {
                lagou.findOneAndUpdate(item, function() {});
            });
        });
    }
}

function getRequest(params, cb) {
    request.post({
        url: req_url,
        form: params
    }, function(err, httpResponse, body) {
        if (err) {
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
        },
        args = process.argv;
    if (args.indexOf('-c') === -1) {
        params.city = '全国';
    } else {
        params.city = args[args.indexOf('-c') + 1];
    }
    if (args.indexOf('-p') === -1) {
        params.kd = '';
    } else {
        params.kd = args[args.indexOf('-p') + 1];
    }
    return params;
}