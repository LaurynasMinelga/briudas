const mongoose = require('mongoose');

const emojiSchema = mongoose.Schema({
    deleted: Boolean,
    ID: String, 
    identifier: String,
    name: String, 
    requiredColons: Boolean
});

var Emoji = module.exports = mongoose.model('Emoji', emojiSchema);

module.exports.get = function (callback, limit) {
    Emoji.find(callback).limit(limit);
  }