/**
 * AdminActionsController
 *
 * @description :: Server-side logic for managing Adminactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var bcrypt = require('bcrypt');

module.exports = {
	createUser: function(req, res){
	  console.log(req.body);
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

    publishArticle:function(req, res){
    	console.log(req.body);
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
    	console.log(req.body);
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
      	if(id){
      		delete model.author;
      		command = Article.update({id: id}, model);
      	}else{
      		model.author = req.session.user.id;
      		command = Article.create(model);
      	}
      	command.exec(function(err, data){
      		if(err){
      			console.error(err);
      			return res.serverError();
      		}
      		return res.redirect('/admin/articles');
      	});    	
    },
};

