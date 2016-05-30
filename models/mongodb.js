var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lagouspider');
exports.mongoose = mongoose;