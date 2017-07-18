/**
 * ViewsController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var moment = require('moment');

function countReader(req, article){
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

var mainMeta = null;

module.exports = {
	home: function(req,res){
		req.setLocale("ru");
		Article.find({limit: 10, where:{isPublished: true}})
		.sort('createdAt DESC')
		.populate('theme')
		.populate('author')
		.exec(function(err, data){
			return res.view('homepage', {articles: data, meta: null});
		});
	},

	theme: function(req, res, next){
		if (req.path.match(/\..*/g) || req.path.match(/^\/api\/.*$/)) {
	        return next();
	    }
	    //console.log(req.query["page"]);
		Theme.findOne({url : req.params.theme})
		.exec(function(err, data){
			if(!data){
      			return next();
      		}
			Article.find({where: {theme: data.id, isPublished: true} ,limit: 10})
			.sort('createdAt DESC')
			.populate('theme')
			.populate('author')
			.exec(function(err, articles){
				var meta = {
					title: data.title
				};
				for (var i = articles.length - 1; i >= 0; i--) {
					articles[i].theme.hide = true;
				}
				return res.view('theme', {articles: articles, theme: data, author:null, meta: meta});
			});
		});		
	},	

	author: function(req, res, next){
		if (req.path.match(/\..*/g) || req.path.match(/^\/api\/.*$/)) {
	        return next();
	    }
	    //console.log(req.query["page"]);
		User.findOne({url : req.params.authorUrl})
		.exec(function(err, user){
			if(!user){
      			return next();
      		}
			Article.find({where: {author: user.id, isPublished: true} ,limit: 10})
			.sort('createdAt DESC')
			.populate('theme')
			.populate('author')
			.exec(function(err, articles){
				var meta = {
					title: user.name
				};
				for (var i = articles.length - 1; i >= 0; i--) {
					articles[i].author.hide = true;
				}
				return res.view('theme', {articles: articles, theme:null, author: user, meta: meta});
			});
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
      		if(req.session.user && req.session.user.isAdmin){
  				isAuthor = true;
  			}
  			if(req.session.user && (req.session.user.id === data.author.id) ){
  				isAuthor = true;
  			}
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
				data : {origin: process.env.LTBLOG_ORIGIN, disqusId: process.env.LTBLOG_ORIGIN || 'the-living-thing-ru', isAuthor: isAuthor}});
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

