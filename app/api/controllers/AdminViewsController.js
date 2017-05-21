/**
 * AdminViewsController
 *
 * @description :: Server-side logic for managing Adminviews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login: function(req,res){
		return res.view('admin/login', {});
	},

	main: function(req,res){
		return res.view('admin/index', {});
	},
};

