Reaction = require('../models/reactionModel');

//GET reactions by message id (req.params.message_id) -dsAdmin
exports.getReactions = function (req, res){
    Reaction.find({message_id: req.params.message_id}, 'emojiID roleID',
        function (err, reactions){
        if (err) return res.status(500).json({error: err});
        if (reactions){
            return res.status(200).json({data: reactions});
        } else {
            return res.status(404).json({message: "Reactions not found"});
        }
    });
};

//PATCH reaction data by message id (req.params.reaction_id) -dsAdmin
exports.updateOne = function (req, res) {
    Reaction.findOneAndUpdate({_id: req.params.message_id},{
        roleID: req.body.roleID
    }, function (err, reaction){
        if (err) return res.status(500).json({error: err});
        return res.status(200).json({message: "Reaction updated"});
    });
}; 