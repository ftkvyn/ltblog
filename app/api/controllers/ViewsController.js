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

	article: function(req,res){
		Article.findOne({id: req.params.id})
		.populate('author')
		.populate('theme')
		.exec(function(err, data){
			if(err){
      			console.error(err);
      			return res.serverError();
      		}
			return res.view('article', {article:data, data : {origin: process.env.LTBLOG_ORIGIN || 'http://ltblog-dev.herokuapp.com'}});	
		});	
	},
	
	about: function(req,res){
		return res.view('about', {});
	},
};

