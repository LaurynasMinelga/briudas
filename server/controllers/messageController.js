Message = require('../models/messageModel');
Reaction = require('../models/reactionModel');

//GET all messages from specified channel (req.params.channel_id) -dsAdmin
exports.getFromChannel = function (req, res) {
    Message.find({channel_id: req.params.channel_id},'_id title',
         function (err, messages){
        if (err) return res.status(500).json({error: err});
        if (messages){
            return res.status(200).json({data: messages});
        } else {
            return res.status(404).json({message: "Messages not found"});
        }
    });
};

//GET specific message (req.params.message_id) -dsAdmin
exports.getOne = function (req, res) {
    Message.findOne({_id: req.params.message_id}, 
        function (err, message) {
        if (err) return res.status(500).json({error: err});
        if (message){
            return res.status(200).json({data: message});
        } else {
            return res.status(404).json({message: "Message not found"});
        }
    });
};

//PATCH specific message (req.params.message_id) -dsAdmin
//ensure hexColor is not null
exports.updateOne = function (req, res) {
    Message.findOneAndUpdate({_id: req.params.message_id},{
        title: req.body.title,
        description: req.body.description,
        footer: req.body.footer,
        hexColor: req.body.hexColor
    }, function (err){
        if (err) return res.status(500).json({error: err});
        return res.status(200).json({message: "Message updated"})
    });
}