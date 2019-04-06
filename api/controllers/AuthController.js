/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcrypt');

module.exports = {
  logout: function (req, res){
    req.session.user = null;
    req.session.userInfo = null;
    res.redirect('/');
  },

  login: function(req, res){
      var login = req.body.login;
      var password = req.body.password;
      User.findOne({login:login}).exec(
        function(err,user){
          if(err){
            console.error(err);
            return res.badRequest('User not found');
          }
          if(!user){
            return res.send({
              success: false,
              message: 'Given login or password is incorrect.'
            });
          }
          else{
            //check password here.
            bcrypt.compare(password, user.password, function(err, result) {
              if (!result){ 
                return res.send({
                  success: false,
                  message: 'Given login or password is incorrect.'
                });
              }
              req.session.user = user;
              return res.send({success: true});
            });
          }
        });

  },
};

