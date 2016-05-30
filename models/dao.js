var mongodb = require('./mongodb');
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
DAO.prototype.findOneAndUpdate = function(params, cb) {
    // https://docs.mongodb.com/manual/reference/command/findAndModify/
    model.findOneAndUpdate({
        positionId: params.positionId
    }, params, {
        // 如果要求变化了就修改，则需要增加update属性
        upsert: true
    }, function(err, doc) {
        if (err) {
            return new Error(err);
        }
        typeof cb === 'function' && cb(err, doc);
    });
};
DAO.prototype.findByName = function(name, cb) {
    model.findOne({
        name: name
    }, function(err, params) {
        if (err) {
            return new Error(err);
        }
        typeof cb === 'function' && cb(err, params);
    });
};
module.exports = new DAO();