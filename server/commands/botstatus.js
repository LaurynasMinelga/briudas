exports.run = (client, message, args) => {
    const status = args.join(' ');
    message.delete();
    client.user.setActivity(status);
};

exports.help = {
    name: 'info'
};