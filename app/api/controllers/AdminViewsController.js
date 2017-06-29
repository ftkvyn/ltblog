/**
 * AdminViewsController
 *
 * @description :: Server-side logic for managing Adminviews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login: function(req,res){
		return res.view('admin/login', {meta: null});
	},

	main: function(req,res){
		return res.view('admin/index', {meta: null});
	},

	users: function(req,res){
		User.find()
		.sort('createdAt DESC')
		.exec(function(err, data){
			if(err){
				console.log(err);
				return res.serverError();
			}

			return res.view('admin/users', {users: data, meta: null});
		});		
	},

	tags: function(req,res){
		return res.view('admin/tags', {meta: null});
	},

	themes: function(req,res){
		Theme.find().exec(function(err, themes){
			return res.view('admin/themes', {themes:themes, meta: null});
		});			
	},

	articles: function(req,res){
		//ToDo: add pagination
		Article.find()
		.sort('createdAt DESC')
		.populate('theme')
		.populate('author')
		.exec(function(err, data){
			if(err){
				console.log(err);
				return res.serverError();
			}
			for (var i = data.length - 1; i >= 0; i--) {
				delete data[i].body;
			}
			Theme.find().exec(function(err, themes){
				return res.view('admin/articles', {articles: data, themes:themes, meta: null});
			});
		});	
	},

	newArticle: function(req,res){
		Theme.find().exec(function(err, themes){
			return res.view('admin/editArticle', {article: {}, themes:themes, meta: null});
		});		
	},

	editArticle: function(req,res){
		Article.findOne({id: req.params.id})
		.exec(function(err, data){
			if(err){
      			console.error(err);
      			return res.serverError();
      		}
      		Theme.find().exec(function(err, themes){
				return res.view('admin/editArticle', {article:data, themes:themes, meta: null});
			});			
		});	
	},

	changePassword: function(req,res){
		return res.view('admin/changePassword', {meta: null});
	},
};

