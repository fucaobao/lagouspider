var req_url = 'http://www.lagou.com/jobs/positionAjax.json';
var request = require('request');

function main() {
    request.post({
        url: req_url,
        form: getArgs()
    }, function(err, httpResponse, body) {
        if (err) {
            throw new Error(err);
        }
        var maxPN = getMaxPN(body);
        maintask(maxPN);
    });
}

function maintask(maxPN) {}

function getMaxPN(value) {
    if (!value) {
        return 0;
    }
    var pageSize = 15; //拉勾网固定为15
    var maxPageNo = 30; //拉勾网最大分页为30
    var positionJSON = JSON.parse(value);
    var totalCount = positionJSON.content.positionResult.totalCount;
    return Math.min(Math.cell(totalCount / pageSize), maxPageNo);
}

function getArgs() {
    var params = {
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
main();