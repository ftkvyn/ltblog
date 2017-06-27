/**
 * ViewsController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	home: function(req,res){
		Article.find({limit: 10})
		.sort('createdAt DESC')
		.populate('theme')
		.populate('author')
		.exec(function(err, data){
			return res.view('homepage', {articles: data});
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
			Article.find({where: {theme: data.id} ,limit: 10})
			.sort('createdAt DESC')
			.populate('theme')
			.populate('author')
			.exec(function(err, articles){
				return res.view('theme', {articles: articles, theme: data});
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
			return res.view('article', {article:data, data : {origin: process.env.LTBLOG_ORIGIN || 'http://ltblog-dev.herokuapp.com'}});	
		});	
	},
	
	about: function(req,res){
		return res.view('about', {});
	},
};

