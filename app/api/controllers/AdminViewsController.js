/**
 * AdminViewsController
 *
 * @description :: Server-side logic for managing Adminviews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login: function(req,res){
		return res.view('admin/login', {});
	},

	main: function(req,res){
		return res.view('admin/index', {});
	},

	users: function(req,res){
		User.find()
		.exec(function(err, data){
			if(err){
				console.log(err);
				return res.error(500);
			}

			return res.view('admin/users', {users: data});
		});		
	},

	tags: function(req,res){
		return res.view('admin/tags', {});
	},

	articles: function(req,res){
		return res.view('admin/articles', {});
	},
};

