var mongodb = require('./mongodb');
var Q = require('q');
var Schema = mongodb.mongoose.Schema;
var DAOSchema = new Schema({
    'positionName': String,
    'positionType': String,
    'workYear': String,
    'education': String,
    'jobNature': String,
    'city': String,
    'createTime': String,
    'positionId': Number,
    'companyShortName': String,
    'companyId': Number,
    'showOrder': Number,
    'haveDeliver': Boolean,
    'calcScore': Boolean,
    'score': Number,
    'positionFirstType': String,
    'salary': String,
    'positionAdvantage': String,
    'deliverCount': Number,
    'companyName': String,
    'companyLogo': String,
    'industryField': String,
    'financeStage': String,
    'companyLabelList': Array,
    'district': String,
    'leaderName': String,
    'companySize': String,
    'imstate': String,
    'createTimeSort': String,
    'positonTypesMap': String,
    'hrScore': Number,
    'flowScore': Number,
    'showCount': Number,
    'pvScore': Number,
    'plus': String,
    'businessZones': Array,
    'publisherId': Number,
    'loginTime': String,
    'appShow': Number,
    'randomScore': Number,
    'countAdjusted': Boolean,
    'relScore': Number,
    'adjustScore': Number,
    'orderBy': Number,
    'formatCreateTime': String,
    'adWord': Number,
    'totalCount': Number,
    'searchScore': Number
});
var model = mongodb.mongoose.model('lagou', DAOSchema);
var DAO = function() {};
/**
 * [findOneAndUpdate description]
 * @param  {Object}   params upsert对象
 */
DAO.prototype.findOneAndUpdate = function(params) {
    var deferred = Q.defer();
    // https://docs.mongodb.com/manual/reference/command/findAndModify/
    model.findOneAndUpdate({
        positionId: params.positionId
    }, params, {
        // 如果要求变化了就修改，则需要增加update属性
        upsert: true
    }, function(error, result) {
        if (error) {
            deferred.reject(error.toString().red);
        }
        deferred.resolve(result);
    });
    return deferred.promise;
};
/**
 * [findOne description]
 * @param  {Object}   params JSON对象，查询条件
 */
DAO.prototype.findOne = function(params) {
    var deferred = Q.defer();
    model.findOne(params, function(error, result) {
        if (error) {
            deferred.reject(error.toString().red);
        }
        deferred.resolve(result);
    });
    return deferred.promise;
};
/**
 * [distinct description]
 * @param  {string}   str 查询对象
 */
DAO.prototype.distinct = function(str) {
    var deferred = Q.defer();
    model.distinct(str, function(error, result) {
        if (error) {
            deferred.reject(error.toString().red);
        }
        deferred.resolve(result);
    });
    return deferred.promise;
};
// DAO.prototype.aggregate = function() {
//     var deferred = Q.defer();
//     model.aggregate().group({
//         _id: {
//             positionId: "$positionId"
//         },
//         count: {
//             $sum: 1
//         }
//     }).match({
//         count: {
//             $gt: 1
//         }
//     }).exec(function(error, result) {
//         if (error) {
//             deferred.reject(error.toString().red);
//         }
//         deferred.resolve(result);
//     });
//     return deferred.promise;
// };
module.exports = new DAO();