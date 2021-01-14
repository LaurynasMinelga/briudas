const mongoose = require('mongoose');

const statVoiceSchema = mongoose.Schema({
    author: String,
    channelID: String, 
    createdAt: Date,
    createdTimestamp: Number,
});

var StatVoice = module.exports = mongoose.model('StatVoice', statVoiceSchema);

module.exports.get = function (callback, limit) {
    StatVoice.find(callback).limit(limit);
  }