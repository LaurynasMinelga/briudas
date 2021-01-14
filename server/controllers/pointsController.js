// Controller for user points
User = require('../models/userModel')
Point = require('../models/pointModel')
Config = require('../config/config')
const mongoose = require('mongoose');

//POST add point (req.user, req.params.user_id) -self
exports.add = function (req, res) {
    User.findOne({_id: req.user._id}, function (err, usr){
        //set one day from now
        var tmp_day_date = usr.points.regularPoint.getTime() + Config.point_user_period;
        //if day has passed
        if (Date.now() >= tmp_day_date){
            Point.findOne({giver: req.user.id, receiver: req.params.user_id},
                function (err, point){
                   //if point exists
               if (point){
                   //set 1 week from now
                   var tmp_date = point.date.getTime() + Config.point_update_period;
                   // if week has passed - add point
                   if (Date.now() >= tmp_date ){
                       Point.updateOne({giver: req.user.id, 
                           receiver: req.params.user_id}, {
                               date: Date.now(),
                               $inc: { amount: 1 }
                           }, function (err, p){
                               User.updateOne({_id: req.user._id},{
                                   points: {regularPoint: Date.now()}
                               });
                               if (err) return res.status(500).json({error: err});
                               return res.status(200).json({
                                    message: "Point added"
                                });
                           });
                   } else {
                       res.status(409).json({message: "Not so fast, Mojo Jojo"});
                   }
               } else {
                   //if point does not exist - create new point
                   var p = new Point();
                   p.giver = req.user.id;
                   p.receiver = req.params.user_id;
                   p.amount = 1;
       
                   p.save(function (err){
                        User.updateOne({_id: req.user._id},{
                            points: {regularPoint: Date.now()}
                        });
                       if (err) return res.status(500).json({error: err});
                       return res.status(200).json({
                            message: "Point added"
                        });
                   });
               }
           });
        } else {
            return res.status(409).json({message: "You are too fast, Mojo Jojo"});
        }
    });
};

//PUT remove last point (req.user._id req.params.user_id) -self
exports.remove = function (req, res) {
    Point.findOne({giver: req.user.id, receiver: req.params.user_id},
        function (err, point) {
            //if point exists
            if (point) {
                var tmp_date = point.date.getTime() + Config.point_remove_period;
                //if less than 30 days has passed - remove point
                if (tmp_date >= Date.now() && point.amount > 0) {
                    Point.updateOne({giver: req.user.id, 
                        receiver: req.params.user_id}, {
                            //date: Date.now(), // do we need date?
                            $inc: { amount: -1 }
                        }, function (err, p){
                            User.updateOne({_id: req.user._id},{
                                points: {regularPoint: Date.now()}
                            });
                            if (err) return res.status(500).json({error: err});
                            return res.status(200).json({message: "Point removed"});
                        });
                } else {
                    res.status(409).json({message: "Time period has passed"});
                }
            } else {
                res.status(404).json({message: "Point not found"});
            }
        });
};

//GET all given points (req.params.user_id) -public
exports.given = function (req, res) {
    Point.countDocuments({giver: req.params.user_id, amount: {$gt: 0}}, function (err, count){
        if (count > 0){
            Point.find({giver: req.params.user_id, amount: {$gt: 0}},'amount receiver')
            .populate('receiver','image username')
            .exec(function (err, points){
                if (err) return res.status(500).json({error: err});
                return res.status(200).json({
                    data: points,
                    count: count
                });
            });
        } else {
            return res.status(404).json({message: "User did not use points"});
        }
    });
};

//GET all received points (req.params.user_id) -public
exports.received = function (req, res) {
    Point.countDocuments({receiver: req.params.user_id, amount: {$gt: 0}}, function (err, count){
        if (count > 0){
            Point.find({receiver: req.params.user_id, amount: {$gt: 0}},'amount receiver')
            .populate('giver','image username')
            .exec(function (err, points){
                if (err) return res.status(500).json({error: err});
                return res.status(200).json({
                    data: points,
                    count: count
                });
            });
        } else {
            return res.status(404).json({message: "User did not receive any points"});
        }
    });
};

//GET points sum a user has received (req.params.user_id) -public
exports.sumReceived = function (req, res){
    Point.aggregate([
    { $match: { receiver: mongoose.Types.ObjectId(req.params.user_id) } },
    { $group: { _id: null, amount: { $sum: "$amount" } } },
    { $project: { _id: 0, amount: 1 }} ])
    .then( function (p){
        //if (err) return res.status(500).json({error: err});
        return res.status(200).json({data: p});
    });
};

//GET points sum a user has given (req.params.user_id) -public
exports.sumGiven = function (req, res){
    Point.aggregate([
    { $match: { giver: mongoose.Types.ObjectId(req.params.user_id) } },
    { $group: { _id: null, amount: { $sum: "$amount" } } },
    { $project: { _id: 0, amount: 1 }} ])
    .then( function (p){
        //if (err) return res.status(500).json({error: err});
        return res.status(200).json({data: p});
    });
};

//GET time until next point (req.user._id) -self
exports.nextPoint = function (req, res){
    User.findOne({_id: req.user._id}, 'points.regularPoint', function (err, user){
        var tmp_new_date = new Date();
        tmp_new_date.setTime(user.points.regularPoint.getTime() + Config.point_user_period);
        console.log(tmp_new_date);
        return res.status(200).json({
            nextPoint: tmp_new_date
        });
    });
};

//GET time until user can receive new point (req.user._id req.params.user_id) -self
exports.nextReceive = function (req, res){
    Point.findOne({giver: req.user._id, receiver: req.params.user_id}, 
        function (err, point){
            if (point) {
                var new_date = new Date();
                new_date.setTime(point.date.getTime()+Config.point_update_period);
                return res.status(200).json({
                    nextPoint: new_date
                });
            } else {
                var new_date = new Date();
                var tmp = new Date();
                tmp = tmp.getTime()-1000000;
                new_date.setTime(tmp); 
                return res.status(200).json({
                    nextPoint: new_date
                });
            }
    });
};

//GET 5 users with most points () -public
exports.top = function (req, res) {
    Point.aggregate([
        { $group: { _id: "$receiver", amount: { $sum: "$amount" } } },
        { $sort: {amount: -1}},
        { $skip: parseInt(req.body.skip,10)},
        { $limit: parseInt(req.body.limit,10)},
        { $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user"},
        { $project: { _id: 1, amount: 1, "user.username": 1}} 
    ])
    .then( function (p){
        return res.status(200).json({data: p});
    })
    .catch(function (err){
        console.log(err);
        return res.status(500).json({error: err});
    });
};