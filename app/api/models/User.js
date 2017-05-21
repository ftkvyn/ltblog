/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	login: {
	    type: 'string',
	    unique: true
	},
	password: {
	    type: 'string'	    
	},
	name: {
	    type: 'string'  
	},
	profilePicSmall: {
		type: 'string'
	},
	profilePicLarge: {
		type: 'string'
	},
	isAdmin:{
		type:'boolean',
		defaultsTo: false
	},
	articles: {
		collection:'Article',
		via:'author'
	},
  }
};

