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

function getMainMeta(req){
	if(mainMeta){
		return mainMeta;
	}else{
		mainMeta = {};
		mainMeta.title = req.__('main__meta__title');
		mainMeta.image = '';
		mainMeta.description = req.__('main__meta__description');
		return mainMeta;
	}
}

module.exports = {
	home: function(req,res){
		req.setLocale("ru");
		Article.find({limit: 10})
		.sort('createdAt DESC')
		.populate('theme')
		.populate('author')
		.exec(function(err, data){
			return res.view('homepage', {articles: data, meta: getMainMeta(req)});
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
				var meta = {
					title: data.title
				};
				return res.view('theme', {articles: articles, theme: data, meta: meta});
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

      		var meta = {
				title: data.title,
				description: data.description,
				image: data.image,
				keywords: data.meta_keywords
			};
			return res.view('article', {article:data, 
				meta: meta,
				data : {origin: process.env.LTBLOG_ORIGIN || 'http://ltblog-dev.herokuapp.com'}});	
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
		return res.view('about', {meta: null});
	},
};

