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
			console.log(req.session.user);
			return res.view('admin/themes', {themes:themes, sessionUser: req.session.user});
		});			
	},

	articles: function(req,res){
		/*console.log(req.query);*/
		var isAdmin = req.session.user.isAdmin;
		var reqQueryPage = req.query.page || false;

		var paginationParams = "";
		if (req.query.length == 0) {
			paginationParams = false;
		} else {
			var countQuery = 0;
			for (var number in req.query) {
				if(countQuery != req.query.length) {
		  		paginationParams += "&";
		  	}
				paginationParams += number + '=' + req.query[number];
		  		countQuery++;
			}
		};
		var page = +req.query.page || 1;
		var PAGE_SIZE = 10;

		var criteria = {};

		delete req.query.page;

		if (req.query) {
			if (req.query.title && req.query.description) {

				criteria.or = [
				    { title: { contains : req.query.title }},
				    { description: { contains : req.query.description }}
				];

			} else if (req.query.title){
				criteria.title = { contains : req.query.title };
			} else if (req.query.description){
				criteria.description = { contains : req.query.description };
			} else {
				criteria = req.query;
			}
		}
		if(req.session.user && !req.session.user.isAdmin){
			criteria.author =  req.session.user.id;
		}

		Theme.find().exec(function(err, themes){
			articlesLoader.loadArticlesPage(criteria, {page : page, pageSize: PAGE_SIZE})
			.then(function(dataload){
				User.find()
					.exec(function(err, users){
					if(err){
						console.log(err);
						return res.serverError();
					}
				return res.view('admin/articles', {articles: dataload.articles, themes:themes, meta: null, page: page, totalPages: dataload.totalPages, author: null, theme: null, users: users, paginationParams: paginationParams, isAdmin: isAdmin});
				});
				
			})
			.catch(function (err) {
		        console.error(err);
		        return res.serverError();
		    })
		    .done();
		});
	},

	newArticle: function(req,res){
		Theme.find().exec(function(err, themes){
			User.find()
				.exec(function(err, users){
				if(err){
					console.log(err);
					return res.serverError();
				}
			return res.view('admin/editArticle', {article: {}, themes:themes, sessionUser: req.session.user, users: users});
			});
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
      			User.find()
				.exec(function(err, users){
					if(err){
						console.log(err);
						return res.serverError();
					}
				return res.view('admin/editArticle', {article:data, themes:themes, sessionUser: req.session.user, users: users});
				});
			});			
		});	
	},

	changePassword: function(req,res){
		return res.view('admin/changePassword');
	},
};

