/**
 * AdminActionsController
 *
 * @description :: Server-side logic for managing Adminactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var bcrypt = require('bcrypt');

module.exports = {
	createUser: function(req, res){
      var login = req.body.login;
      var password = req.body.password;
      if(password.length < 6){
        return res.send({
                  success: false,
                  message: 'Password should be at least 6 characters long.'
                });
      }
      User.findOne({login:login}).exec(
        function(err,user){
          if(err){
            console.error(err);
            return res.badRequest('Error.');
          }
          
          if(user){
            return res.send({
                  success: false,
                  message: 'User with this login is already registered.'
                });
          }
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
              if (err) {
                console.error(err);
                return res.badRequest('Error.');
              }else{
                var userData = {
                  login: login,
                  password: hash,
                  name: req.body.name,
                  profilePicSmall:req.body.profilePicSmall,
                  profilePicLarge:req.body.profilePicLarge,
                  
                };
                User.create(userData).exec(function (err, user) {
                  if (user) {            
                    req.session.user = user;
                    return res.send({success:true});
                  } else {
                    console.error(err);
                    return res.send({success:false,message:'Error occured.'});
                  }
                });
              }
            });
          });
        });
      },
};

