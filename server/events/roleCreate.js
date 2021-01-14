Role = require('../models/roleModel');

module.exports = (client, role) => {

    // Add channel to database
        var ro = new Role();
        ro.calculatedPosition = role.calculatedPosition;
        ro.deleted = role.deleted;
        ro.ID = role.id;
        ro.name = role.name;
        ro.position = role.position;

        // save the channel and check for errors
        ro.save(function (err) {
            if (err) return console.log(err);
          });
}