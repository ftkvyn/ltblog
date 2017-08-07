/**
 * AdminViewsController
 *
 * @description :: Server-side logic for managing Adminviews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login: function(req,res){
		return res.view('admin/login');
	},

	main: function(req,res){
		return res.view('admin/index', { data: {isAdmin: req.session.user.isAdmin}});
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
		return res.view('admin/tags');
	},

	themes: function(req,res){
		Theme.find().exec(function(err, themes){
			return res.view('admin/themes', {themes:themes});
		});			
	},

	articles: function(req,res){
		 var page = +req.query.page || 1;
		 var PAGE_SIZE = 10;

		 var criteria = {author: req.session.user.id};
		 if(req.session.user && req.session.user.isAdmin){
			criteria = {};
		 }
		/*var query = Article.find({author: req.session.user.id});
		if(req.session.user && req.session.user.isAdmin){
			query = Article.find();
		}*/
		
		/*query
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
			}*/
			Theme.find().exec(function(err, themes){
				/*return res.view('admin/articles', {articles: data, themes:themes});*/

				articlesLoader.loadArticlesPage(criteria, {page : page, pageSize: PAGE_SIZE})
				.then(function(datadata){
					return res.view('admin/articles', {articles: datadata.articles, themes:themes, meta: null, page: page, totalPages: datadata.totalPages, author: null, theme: null,});
				})
				.catch(function (err) {
			        console.error(err);
			        return res.serverError();
			    })
			    .done();
			});
		/*});	*/
	},

	newArticle: function(req,res){
		Theme.find().exec(function(err, themes){
			return res.view('admin/editArticle', {article: {}, themes:themes});
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
      			if(!req.session.user.isAdmin){
      				if(data.author !== req.session.user.id){
      					return res.notFound();
      				}
      			}
				return res.view('admin/editArticle', {article:data, themes:themes});
			});			
		});	
	},

	changePassword: function(req,res){
		return res.view('admin/changePassword');
	},
};

