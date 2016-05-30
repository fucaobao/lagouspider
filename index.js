var request = require('request');
var lagou = require('./models/dao.js');
var req_url = 'http://www.lagou.com/jobs/positionAjax.json';
var argv = process.argv;
main();

function main() {
    if (argv.indexOf('-c') === -1 || argv.indexOf('-p') === -1) {
        console.log([
            'WARNING',
            'usage: node [city] [position]',
            '',
            'options:',
            '  -c city       城市(默认为"全国")',
            '  -p position   岗位名称(无默认值)'
        ].join('\n'));
    }
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
                item.companyLogo = 'http://www.lagou.com/' + item.companyLogo;
                //有则不变，没有则增加
                lagou.findOneAndUpdate(item, function(err, doc) {});
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