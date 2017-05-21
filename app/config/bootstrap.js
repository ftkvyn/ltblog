/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var bcrypt = require('bcrypt');

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  User
	.count()
	.exec(function(err, data){
		if(data === 0){
			var pass = 'admin123';
			 bcrypt.genSalt(10, function(err, salt) {
	            bcrypt.hash(pass, salt, function(err, hash) {
				var userData = {
	              login: 'admin',
	              password: hash,
	              isAdmin: true,
	              name: 'Main admin',
	              profilePicSmall: 'https://ltblog-dev.herokuapp.com/images/hedg.jpg',
	              profilePicLarge: 'https://ltblog-dev.herokuapp.com/images/hedg.jpg',	              
	            };
	            User.create(userData).exec(function (err, user) {});
        	})
        });
		}
	});
  cb();
};
