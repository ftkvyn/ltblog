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
                  url: req.body.url,
                  about: req.body.about  
                };
                User.create(userData).exec(function (err, user) {
                  if (user) {            
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

      deleteUser:function(req, res){
      	console.log(req.body);
      	var id = req.body.id;
      	if(id == req.session.user.id){
  			return res.error("Can't remove self");
  		}
      	Article.find({author: id})
      	.exec(function(err, data){
      		if(err){
      			console.log(err);
      			return res.serverError();
      		}
      		if(data && data.length > 0){
      			return res.error("Can't remove author");
      		}
      		User.destroy({id:id})
      		.exec(function(err, data){
      			if(err){
	      			console.log(err);
	      			return res.serverError();
	      		}
	      		return res.redirect('/admin/users');
      		});
      	});
      },

      getUserData:function(req, res){
        
        var id = req.params.id;
        if(!id){
            return res.send({success:false, message:'Error occurred.'});
        }
        User.findOne({id:id}).exec(
          function(err,editUser){
            if(err){
              console.error(err);
              return res.send({success:false, message:'Error occurred.'});
            }
            if(!editUser) {
              return res.send({success:false, message:'User not found.'});
            }
            return res.send({success:true, editUser: editUser});
        });
      },

    saveUser:function(req, res){

      var id = req.body.id;
      var login = req.body.login;

      User.findOne({id:id}).exec(
        function(err,user){
          if(err){
            console.error(err);
            return res.send({success:false, message:'Error occurred.'});
          }
          if(!user) {
            console.error(err);
            return res.send({success:false, message:'serverError.'});
          }
          delete req.body.password;
          User.update({id: id}, req.body)
            .exec(function(err, data){
              if(err){
                console.error(err);
                return res.serverError();
              }
              return res.send({success:true});
          });
      });
    },

    publishArticle:function(req, res){

      	var id = req.body.id;
      	Article.update({id: id}, {isPublished: true})
      	.exec(function(err, data){
      		if(err){
      			console.error(err);
      			return res.serverError();
      		}
      		return res.redirect('/admin/articles');
      	}); 
    },

    hideArticle:function(req, res){

      	var id = req.body.id;
      	Article.update({id: id}, {isPublished: false})
      	.exec(function(err, data){
      		if(err){
      			console.error(err);
      			return res.serverError();
      		}
      		return res.redirect('/admin/articles');
      	}); 
    },

    saveArticle:function(req, res){
      	var id = req.body.id;
      	var command = null;
      	var model = req.body;

        if(id && +id){
        /*  delete model.author;*/

          if (!req.session.user.isAdmin && req.body.author) { /* req.body.author д.б. undefined в норм состоянии */
            return res.badRequest('Error.');
          }
          command = Article.update({id: id}, model);
        }else{
          if(!req.session.user.isAdmin) {
            model.author = req.session.user.id;
          };
          delete model.id;
          command = Article.create(model);
        }
        command.exec(function(err, data){
          if(err){
            console.error(err);
            return res.send({success: false});
          }
          var id = data.id || data[0].id;
          return res.send({success: true, id: id});
        }); 
    },

    changePasswords:function(req, res){ 

        var FormCurrentPassword = req.body.currentPassword;
        var FormNewPassword = req.body.newPassword;
        var thisIdUser = req.session.user.id;

        User.findOne({id:thisIdUser}).exec(
          function(err,user){
            if(err){
              console.error(err); 
              return res.badRequest('Error.');
            }
            if(!user) {
              return res.send({success:false, message:'User not found.'});
            }
            bcrypt.compare(FormCurrentPassword, user.password, function(err, result) {
              if (err) { 
                console.error(err);
                return res.badRequest('Error.'); 
              }
              if(!result) {
                return res.send({success:false, message:'Invalid current password.'});
              }
              bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(FormNewPassword, salt, function(err, hash) {
                  if (err) {
                    console.error(err);
                    return res.badRequest('Error.');
                  }
                  user.password = hash;
                  User.update({id: user.id}, {password: hash}).exec(
                    function(err, user){
                      if(err){
                        console.error(err);
                        return res.badRequest('Error.');
                      }
                      return res.send({success:true});
                  });  
                });
              });
            });
        });
    },
    changeDate:function(req, res){ 

      var id = req.body.id;

      if (!req.session.user.isAdmin) {
        return res.badRequest('Error.');
      }
      Article.update({id: id}, req.body)
      .exec(function(err, data){
        if(err){
          console.error(err);
          return res.serverError();
        }
        console.log('------------');
        console.log(data);
        return res.redirect('/admin/articles');
      });

    }


};
