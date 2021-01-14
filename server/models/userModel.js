const mongoose = require('mongoose');

// =======
// Schema
// =======
const userSchema = mongoose.Schema({
  image: String,
  roles: {
    superAdmin: Boolean,
    webAdmin: Boolean,
    dsAdmin: Boolean
  },
  points: {
    regularPoint: Date
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  discord: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  twitch: {
    id: {
      type: String
    },
    login: {
      type: String
    },
    image: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  }
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.get = function (callback, limit) {
  User.find(callback).limit(limit);
}