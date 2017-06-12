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
		.sort('createdAt DESC')
		.exec(function(err, data){
			if(err){
				console.log(err);
				return res.serverError();
			}

			return res.view('admin/users', {users: data});
		});		
	},

	tags: function(req,res){
		return res.view('admin/tags', {});
	},

	articles: function(req,res){
		Article.find()
		.sort('createdAt DESC')
		.populate('author')
		.exec(function(err, data){
			if(err){
				console.log(err);
				return res.serverError();
			}
			for (var i = data.length - 1; i >= 0; i--) {
				delete data[i].body;
			}
			return res.view('admin/articles', {articles: data});
		});	
	},

	newArticle: function(req,res){
		return res.view('admin/editArticle', {article: {}});
	},

	editArticle: function(req,res){
		Article.findOne({id: req.params.id})
		.exec(function(err, data){
			if(err){
      			console.error(err);
      			return res.serverError();
      		}
			return res.view('admin/editArticle', {article:data});
		});	
	},
	changePassword: function(req,res){
		return res.view('admin/changePassword', {});
	},
};

