// Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
Channel = require('../models/channelModel');
Member = require('../models/memberModel');
StatVoice = require('../models/statbot/statVoiceModel');

module.exports = (client, oldMember, newMember) => {
    
    // check if user joined or left a channel
    if ( oldMember.voiceChannelID == undefined && 
        newMember.voiceChannelID != null) {

            // user joined new channel
            var presentDate = Date.now();
            var presentTime = new Date().getTime();

            StatVoice.findOneAndUpdate( { author: oldMember.id }, {
                author:oldMember.id,
                channelID: newMember.voiceChannelID,
                createdAt: presentDate,
                createdTimestamp: presentTime
            }, {upsert: true}, function (err) {
                if (err) return console.log(err); 
            });

    } else if (oldMember.voiceChannelID !== undefined && 
        newMember.voiceChannelID !== null) {

            // user changed channel

            // delete stat doc
            StatVoice.findOneAndDelete( { author: oldMember.id },
                 function (err, voice) {
                if (err) return console.log(err);
                
                if (voice != null) {

                    // calculate voice points
                    var points = Math.abs(new Date() - voice.createdAt);
                    var points = Math.round(points*0.000001666);

                    // update member voice points
                    Member.findOneAndUpdate({ID: newMember.id}, {
                        $inc: { voicePointsTotal: points }
                    }, function (err) {
                        if (err) return console.log(err);
                    });

                    //update channel voice points
                    Channel.findOneAndUpdate({ID: oldMember.voiceChannelID}, {
                        $inc: { voicePointsTotal: points }
                    }, function (err) {
                        if (err) return console.log(err);
                    });

                    // create new stat doc
                    var presentDate = Date.now();
                    var presentTime = new Date().getTime();

                    StatVoice.findOneAndUpdate( { author: oldMember.id }, {
                        author:oldMember.id,
                        channelID: newMember.voiceChannelID,
                        createdAt: presentDate,
                        createdTimestamp: presentTime
                    }, {upsert: true}, function (err) {
                        if (err) return console.log(err); 
                    });
                }
            });

    } else if (newMember.voiceChannelID === null) {
            
            // user left channel

            StatVoice.findOneAndDelete({author: newMember.id}, 
                function(err, voice) {

                    if (voice != null) {

                        // calculate voice points
                        var points = Math.abs(new Date() - voice.createdAt);
                        var points = Math.round(points*0.000001666);
                        
                        // update member voice points
                        Member.findOneAndUpdate({ID: newMember.id}, {
                            $inc: { voicePointsTotal: points }
                        }, function (err) {
                            if (err) return console.log(err);
                        });

                        // update channel voice points
                        Channel.findOneAndUpdate({ID: oldMember.voiceChannelID}, {
                            $inc: { voicePointsTotal: points }
                        }, function (err) {
                            if (err) return console.log(err);
                        });
                    }
            });
    }
};