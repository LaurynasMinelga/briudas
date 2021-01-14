Channel = require('../models/channelModel');
Message = require('../models/messageModel');

//GET all channels containing messages (req.user._id) -dsAdmin
exports.index = function (req, res) {
    Message.aggregate([
        {$lookup: {
            from: "channels",
            localField: "channel_id",
            foreignField: "_id",
            as: "channel"
        }},
        {$unwind: "$channel"},
        {$group: {
            _id: "$channel._id",
            name: {$first: "$channel.name"},
            count: {$sum: 1}
        }}
    ]).exec(function (err, channels){
        if (err) res.status(500).json({error: err});
        return res.status(200).json({data: channels});
    });
};