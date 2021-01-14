const mongoose = require('mongoose');
const { uri } = require('../auth.json');

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        mongoose.set('useFindAndModify', false);
        mongoose.connect(uri, dbOptions);
        mongoose.Promise = global.Promise;

        var db = mongoose.connection;
        db.on('connected', () => {
            console.log(`Connected to database on ${uri}`)
        });

        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    }
};