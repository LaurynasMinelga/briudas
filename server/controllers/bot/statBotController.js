// Controller for stat-bot data extraction
Member = require('../../models/memberModel');


// GET most active total voice users (req.user) 
exports.voiceUserListTotal = function (req, res) {
    Member.aggregate([
        { $match: { voicePointsTotal: { $gt: 0} } },
        { $sort: { voicePointsTotal: -1 } },
        { $limit: 7 },
        { $project: {avatar: 1, nickname: 1, voicePointsTotal: 1} }
    ])
    .then( function (stats) {
        return res.status(200).json({data: stats});
    })
    .catch(function (err){
        console.log(err);
        return res.status(500).json({error: err});
    });
}

// GET most active total voice channels (req.user)
exports.voiceChannelListTotal = function (req, res) {

}

// GET most active total message users (req.user)
exports.messageUserListTotal = function (req, res) {

}

// GET most active total message channels (req.user) 
exports.messageChannelListTotal = function (req, res) {

}

//============== 30 days statistics ================

// GET most active recent voice users (req.user) 
exports.voiceUserList = function (req, res) {

}

// GET most active recent voice channels (req.user)
exports.voiceChannelList = function (req, res) {

}

// GET most active recent message users (req.user)
exports.messageUserList = function (req, res) {

}

// GET most active recent message channels (req.user) 
exports.messageChannelList = function (req, res) {

}