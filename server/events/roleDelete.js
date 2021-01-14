Role = require('../models/roleModel');

module.exports = (client, role) => {

        // delete channel from database
        Role.deleteOne({ ID: role.id }, function (err) {
            if (err) return console.log(err);
          });
}