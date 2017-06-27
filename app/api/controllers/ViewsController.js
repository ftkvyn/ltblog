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
      		countReader(req, data);
			return res.view('article', {article:data, data : {origin: process.env.LTBLOG_ORIGIN || 'http://ltblog-dev.herokuapp.com'}});	
		});	
	},
	
	relates: function(req, res){
		//ToDo: implement logic
		Article.find({limit: 5})
		.sort('createdAt DESC')
		.populate('theme')
		.populate('author')
		.exec(function(err, data){
			return res.view('relates', {articles: data, layout: null});
		});
	},

	about: function(req,res){
		return res.view('about', {});
	},
};

