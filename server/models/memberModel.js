//discord member schema
Role = require('../models/roleModel');
const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
    deleted: Boolean,
    displayName: String, 
    avatar: String,
    ID: String, 
    joinedAt: Date, 
    joinedTimestamp: Number,
    mute: Boolean, 
    nickname: String, 
    serverDeaf: Boolean,
    hasAdmin: Boolean,
    avatarURL: String,
    voicePoints: Number,
    voicePointsTotal: Number,
});

var Member = module.exports = mongoose.model('Member', memberSchema);

module.exports.get = function (callback, limit) {
    Member.find(callback).limit(limit);
  }