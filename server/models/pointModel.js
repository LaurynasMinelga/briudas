const mongoose = require('mongoose');

const pointSchema = mongoose.Schema({
    giver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date: { type: Date, default: Date.now() },
    amount: {type: Number, default: 0}
});

var Point = module.exports = mongoose.model('Point', pointSchema);

module.exports.get = function (callback, limit) {
    Point.find(callback).limit(limit);
  }