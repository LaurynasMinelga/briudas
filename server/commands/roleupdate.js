const { RichEmbed } = require('discord.js');
Message = require('../models/messageModel');
Reaction = require('../models/reactionModel');

exports.run = async (client, message, args) => {
    message.delete();
    if (message.member.roles.find(r => r.name === ".")){

        //update all role messages in server from database
        Message.get(function (err, msg) {
            msg.forEach( me => {

                //update embed
                let embed = new RichEmbed()
                    .setDescription(me.description)
                    .setColor(me.hexColor)
                    .setTitle(me.title)
                    .setFooter(me.footer);

                //get message object
                if (message.channel.id === me.channelID) {
                    message.channel.fetchMessage(me.ID)
                    .then(fethed => {
                    //if (typeof fetched !== 'undefined' && fethed !== null){
                       //update message
                        fethed.edit(embed); 
                    //}
                    }).catch(console.error);
                }
            });
        }); 
    }else {
        message.channel.send("```fix\nMessage restricted.. ```")
              .then (msg => {
                  msg.delete(10000)
              }).catch(console.error);
    }  
};

exports.help = {
    name: 'roleupdate'
};