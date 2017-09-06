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
		var reqQueryPage = req.query.page || false;
		var FindRes = [];

			Article.find()
				.exec(function(err, articles){
				if(err){
					console.log(err);
					return res.serverError();
				}
				delete req.query.page;
				var reqCount = 0;
				for (var g in req.query) {
					reqCount++;
				}
				
				for (var article in articles) {
					var SearchCount = 0;
					var MiddleArray = {};
					var FindSuccess = 'none';
					var FindTitle = false;
					var FindDescr = false;
					for (var key in articles[article]) {
						for (var i in req.query) {
							if (i == key) { 
								SearchCount ++;
								if (i == 'author') {
									if ((articles[article].author == +req.query[i]) && (FindSuccess == true) ||
										(articles[article].author == +req.query[i]) && (FindSuccess == 'none')/* && (reqCount == 1)*/) {
										FindSuccess = true;
										if (!MiddleArray.id) {
											MiddleArray.id = articles[article].id;
										}
									}
									else {
										FindSuccess = false;
									}
								}else{
									var SymbolArray = req.query[i].split(" ");
									for (j = 0; j < SymbolArray.length; j++) {
										var Search = articles[article][key].search(SymbolArray[j]);
										if ((Search != -1 && FindSuccess == 'none') || 
											(Search != -1 && FindSuccess == true)) {
											FindSuccess = true;
											if (i == 'title') {
												 FindTitle = true;
											} else if (i == 'description') {
												 FindDescr = true;
											}
											if (!MiddleArray.id) {
												MiddleArray.id = articles[article].id;
											}
										}
									}
								}
							}
							if (reqCount == SearchCount){ 
								if (FindTitle && FindDescr) {
									FindSuccess = true;
								}
								if ((FindSuccess == 'none')) {
									FindSuccess = false;
								}
								if (req.query.description && req.query.title &&
									!FindTitle && !FindDescr) {
									FindSuccess = false;
								}
								if (!req.query.description && req.query.title &&
									!FindTitle) {
									FindSuccess = false;
								}
								if (!req.query.title && req.query.description &&
									!FindDescr) {
									FindSuccess = false;
								}
								if (FindSuccess) {
									var a = FindRes.length;
									if (a == 0 || (FindRes[a-1].id != articles[article].id)) {
										if (FindTitle && FindDescr) {
											FindRes.unshift(MiddleArray);
										}
										FindRes.push(MiddleArray);
									} else {

									}
								}
							}
						}
					}
				}
				if(reqQueryPage) {
					req.query.page = reqQueryPage;
				}
				/*console.log(FindRes);*/
				var page = +req.query.page || 1;
				var PAGE_SIZE = 10;
				var idFindArray = [];
				for (var q =0; q < FindRes.length; q++) {
					var a = FindRes[q].id;
					idFindArray.push(a);
				}
				/*console.log(idFindArray);*/
				var criteria = {author: req.session.user.id};
				if(req.session.user && req.session.user.isAdmin){
					criteria = {}; 
					if(FindRes.length != 0) {
						criteria = {id: idFindArray};
					}
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
						return res.view('admin/articles', {articles: dataload.articles, themes:themes, meta: null, page: page, totalPages: dataload.totalPages, author: null, theme: null, users: users});
						});
						
					})
					.catch(function (err) {
				        console.error(err);
				        return res.serverError();
				    })
				    .done();
				});
			});

		/*}*/

		/*var page = +req.query.page || 1;
		var PAGE_SIZE = 10;
		var idFindArray = [];
		for (var q =0; q < FindRes.length; q++) {
			var a = FindRes[q].id;
			console.log(a);
			idFindArray.push(a);
		}
		console.log(idFindArray);
		var criteria = {author: req.session.user.id};
		if(req.session.user && req.session.user.isAdmin){
			criteria = {};
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
					return res.view('admin/articles', {articles: dataload.articles, themes:themes, meta: null, page: page, totalPages: dataload.totalPages, author: null, theme: null, users: users});
					});
					
				})
				.catch(function (err) {
			        console.error(err);
			        return res.serverError();
			    })
			    .done();
			});*/
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

