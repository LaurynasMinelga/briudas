const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    afkChannel: String,
    afkChannelID: String,
    memberCount: Number, 
    name: String, 
    ownerID: String,
    welcomeChannelID: String
});

var Guild = module.exports = mongoose.model('Guild', guildSchema);

module.exports.get = function (callback, limit) {
    Guild.find(callback).limit(limit);
  }