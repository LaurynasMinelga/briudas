Role = require('../models/roleModel');

//GET all discord roles from guild (req.user._id) -dsadmin
exports.index = function (req, res) {
    Role.find({},'ID name',function (err, roles) {
        if (err) return res.status(500).json({error: err});
        if (roles) {
            res.status(200).json({
                data: roles
            });
        } else {
            res.status(404).json({
                message: "No role found"
            });
        }
    });
};