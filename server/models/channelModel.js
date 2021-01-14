const mongoose = require('mongoose');

const channelSchema = mongoose.Schema({
    createdAt: Date,
    deleted: Boolean,
    ID: String,
    name: String, 
    position: String,
    type: String,
    voicePoints: Number,
    voicePointsTotal: Number,
});

var Channel = module.exports = mongoose.model('Channel', channelSchema);

module.exports.get = function (callback, limit) {
    Channel.find(callback).limit(limit);
  }