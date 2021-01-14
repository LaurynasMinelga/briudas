Role = require('../models/roleModel');

module.exports = (client, oldRole, role) => {

    //update channel and save to database
    Role.findOneAndUpdate({ID: oldRole.id}, {
        calculatedPosition: role.calculatedPosition,
        deleted: role.deleted,
        ID: role.id,
        name: role.name,
        position: role.position,
    }, { upsert: true },function(err, numberAffected, rawResponse) {
        if (err) return console.log(err);
    });
}