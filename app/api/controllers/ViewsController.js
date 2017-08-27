/**
 * ViewsController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var moment = require('moment');

function countReader(req, article){
	if(req.session.user){
		//Not counting site authors.
		return;
	}
	var checkDate = moment().add(12, 'hours').toDate();
	ReadedArticle.find({
		reader: req.session.reader.id,
		createdAt: {'<' : checkDate}
	}).exec(function(err, data){
		if(err){
			console.error(err);
			return;
		}
		if(data && data.length){
			return;
		}
		var model = {};
		model.article = article.id;
		model.reader = req.session.reader.id;
		ReadedArticle.create(model)
		.exec(function(err, data){
			if(err){
				console.error(err);
				return;
			}	
			return;
		});
	})

}

var PAGE_SIZE = 10;

module.exports = {
	home: function(req,res){
		var page = +req.query.page || 1;
		
		articlesLoader.loadArticlesPage({isPublished: true}, {page : page, pageSize: PAGE_SIZE})
		.then(function(data){
			return res.view('homepage', {articles: data.articles, meta: null, page: page, totalPages: data.totalPages, theme: null, author: null});
		})
		.catch(function (err) {
	        console.error(err);
	        return res.serverError();
	    })
	    .done();	
	},

	theme: function(req, res, next){ 
		if (req.path.match(/\..*/g) || req.path.match(/^\/api\/.*$/)) {
	        return next();
	    }
	    var page = +req.query.page || 1;

		Theme.findOne({url : req.params.theme})
		.exec(function(err, theme){
			if(!theme){
      			return next();
      		}

      		articlesLoader.loadArticlesPage({theme: theme.id, isPublished: true}, {page : page, pageSize: PAGE_SIZE})
			.then(function(data){
				var meta = {
					title: theme.title
				};
				for (var i = data.articles.length - 1; i >= 0; i--) {
					data.articles[i].theme.hide = true;
				}
				return res.view('theme', {articles: data.articles, meta: meta, page: page, totalPages: data.totalPages, theme: theme, author: null});
			})
			.catch(function (err) {
		        console.error(err);
		        return res.serverError();
		    })
		    .done();
		});		
	},	

	author: function(req, res, next){
		//Ugly spike, I know. 
		//ToDo: create normal solution.
		if(req.params.authorUrl != 'gleb.simonov'){
			if (req.path.match(/\..*/g) || req.path.match(/^\/api\/.*$/)) {
		        return next();
		    }
		}
	    var page = +req.query.page || 1;

		User.findOne({url : req.params.authorUrl})
		.exec(function(err, user){
			if(!user){
      			return next();
      		}

      		articlesLoader.loadArticlesPage({author: user.id, isPublished: true}, {page : page, pageSize: PAGE_SIZE})
			.then(function(data){
				var meta = {
					title: user.name
				};
				for (var i = data.articles.length - 1; i >= 0; i--) {
					data.articles[i].author.hide = true;
				}
				return res.view('theme', {articles: data.articles, meta: meta, page: page, totalPages: data.totalPages, theme: null, author: user});
			})
			.catch(function (err) {
		        console.error(err);
		        return res.serverError();
		    })
		    .done();
		});		
	},	

	article: function(req, res, next){
		if (req.path.match(/\..*/g) || req.path.match(/^\/api\/.*$/)) {
	        return next();
	    }
		Article.findOne({id: req.params.id})
		.populate('author')
		.populate('theme')
		.populate('views')
		.exec(function(err, data){
			if(err){
      			console.error(err);
      			return res.serverError();
      		}
      		if(!data){
      			return next();
      		}
      		if(data.theme.url != req.params.theme){
      			return next();	
      		}
      		var isAuthor = false;
      		//Not all authors can see all the drafts.
      		if(req.session.user){
      			isAuthor = true;
      		}
      		//ToDo: remove in september or later.
     //  		if(req.session.user && req.session.user.isAdmin){
  			// 	isAuthor = true;
  			// }
  			// if(req.session.user && (req.session.user.id === data.author.id) ){
  			// 	isAuthor = true;
  			// }
      		if(!data.isPublished){
      			//admin and author can view it.
      			if(!isAuthor){
      				return next();
      			}
      		}
      		countReader(req, data);

      		var meta = {
				title: data.title,
				description: data.description,
				image: data.image,
				keywords: data.meta_keywords
			};
			return res.view('article', {article:data, 
				meta: meta,
				data : {origin: process.env.LTBLOG_ORIGIN, disqusId: process.env.LTBLOG_DISQUS_ID || 'the-living-thing-ru', isAuthor: isAuthor}});
		});	
	},

	relates: function(req, res){
		//ToDo: implement logic
		Article.find({limit: 5, where: {isPublished: true}})
		.sort('createdAt DESC')
		.populate('theme')
		.populate('author')
		.exec(function(err, data){
			return res.view('relates', {articles: data, layout: null});
		});
	},

	about: function(req,res){
		return res.view('about');
	},

};

