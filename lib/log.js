var winston = require('winston');//日志包
var logger = new (winston.Logger)({
    transports: [
        new(winston.transports.File)({
            name: 'info-file',
            filename: './logs/lagou-info.log',
            level: 'info'
        }),
        new(winston.transports.File)({
            name: 'error-file',
            filename: './logs/lagou-error.log',
            level: 'error'
        })
    ]
});
module.exports = logger;