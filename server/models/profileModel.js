const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    image: String,
    name: String, 
    surname: String, 
    nickname: String, 
    about: String, 
    birthday: Date, 
    city: String, 
    settings: {
        twitch: {
            sharing: {
                type: Boolean
            },
            panel: {
                type: Boolean
            },
        },
        discord: {
            panel: {
                type: Boolean
            },
        },
    }
});

var Profile = module.exports = mongoose.model('Profile', profileSchema);

module.exports.get = function (callback, limit) {
    Profile.find(callback).limit(limit);
  }