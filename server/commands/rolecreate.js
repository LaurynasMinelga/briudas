const { RichEmbed } = require('discord.js');
Message = require('../models/messageModel');
Channel = require('../models/channelModel');
const { admin } = require('../../auth.json');

var array = ["640311114512596992",
"640328805050875917",
"640328804988092436",
"640328805394808842",
"640328805273174056",
"640328805319442462",
"640328805382225930",
"640328805344477185",
"640328805394808872",
"640328805369511938"];

exports.run = async (client, message, args) => {
    message.delete();
    let embed = new RichEmbed()
        .setDescription("Message added!\n"+
        "[Click here to add roles](https://dsnetwork.com)\n")
        .setColor("0xff0000")
        .setTitle("Pasiimk rolę")
        .setFooter(" ");

    if (message.member.roles.find(r => r.name === ".")){
        if (args.length < 1 || args[0] > 10 || args[0] < 1){
            message.channel.send("```fix\nSyntax incorrect.. "+
              "\nCorrect synttax is:\n -rolecreate emoji-count[0-10]\n"+
              "Ex. -rolecreate 9```")
              .then (msg => {
                  msg.delete(10000)
              }).catch(console.error);
        } else {
            message.channel.send(embed)
            .then(async sent => {
                Channel.findOne({ID : sent.channel.id}, async function(err, c){
                    var me = new Message();
                    me.channelID = sent.channel.id;
                    me.channel_id = c._id;
                    me.content = sent.content;
                    me.ID = sent.id;
                    me.deleted = sent.deleted;
                    sent.embeds.forEach((emb) => {
                        me.description = emb.description;
                        me.footer = emb.footer;
                        me.hexColor = emb.hexColor;
                        me.title = emb.title;
                    });
                    //save message to database
                    me.save(function (err) {
                        if (err) return console.log(err);
                    });

                    // apply reactions to create database entry
                    var i;
                    for ( i = 0; i < args[0]; i++){
                        await sent.react(array[i]);
                    }
                });
            });
        }
    } else {
        message.channel.send("```fix\nMessage restricted.. ```")
              .then (msg => {
                  msg.delete(10000)
              }).catch(console.error);
    }
};

exports.help = {
    name: 'rolecreate'
};