const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    calculatedPosition: Number, 
    deleted: Boolean, 
    ID: String, 
    name: String, 
    position: Number
});

var Role = module.exports = mongoose.model('Role', roleSchema);

module.exports.get = function (callback, limit) {
    Role.find(callback).limit(limit);
  }