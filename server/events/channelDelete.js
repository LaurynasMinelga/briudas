Channel = require('../models/channelModel');

module.exports = (client, channel) => {

        // delete channel from database
        Channel.deleteOne({ ID: channel.id }, function (err) {
            if (err) return console.log(err);
          });
}