const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    channelID: String,
    channel_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Channel'},
    content: String,
    ID: String, 
    deleted: String,
    description: String,
    footer: String, 
    hexColor: String, 
    title: String
});

var Message = module.exports = mongoose.model('Message', messageSchema);

module.exports.get = function (callback, limit) {
    Message.find(callback).limit(limit);
  }