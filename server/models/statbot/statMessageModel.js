const mongoose = require('mongoose');

const statMessageSchema = mongoose.Schema({
    author: String,
    channelID: String, 
    createdAt: Date,
    createdTimestamp: Number, 
});

var StatMessage = module.exports = mongoose.model('StatMessage', statMessageSchema);

module.exports.get = function (callback, limit) {
    StatMessage.find(callback).limit(limit);
  }