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
		var id = req.params.id;
		return res.view('article' + id, {});
	},
	about: function(req,res){
		return res.view('about', {});
	},
};

