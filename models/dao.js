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
    'searchScore': Number,
    'create_date': {
        'type': Date,
        'default': Date.now
    }
});
var model = mongodb.mongoose.model("lagou", DAOSchema);
var DAO = function() {};
DAO.prototype.findOneAndUpdate = function(obj, cb) {
    var query = {
        positionId: obj.positionId
    };
    model.findOneAndUpdate(query, obj, {
        upsert: true
    }, function(err, doc) {
        if (err) {
            return new Error(err);
        }
        typeof cb === 'function' && cb(err);
    });
};
DAO.prototype.findByName = function(name, cb) {
    model.findOne({
        name: name
    }, function(err, obj) {
        if (err) {
            return new Error(err);
        }
        typeof cb === 'function' && cb(err, obj);
    });
};
module.exports = new DAO();