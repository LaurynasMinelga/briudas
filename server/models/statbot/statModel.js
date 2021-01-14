const mongoose = require('mongoose');

const statSchema = mongoose.Schema({
    id: Number,
    totalMembers: Number, 
    
});

var Stat = module.exports = mongoose.model('Stat', statSchema);

module.exports.get = function (callback, limit) {
    Stat.find(callback).limit(limit);
  }