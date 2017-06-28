/**
 * Article.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	title:{
  		type:'string',
  		required: true,
  	},
  	description:{
  		type:'string',
  		required: true,
  	},
    meta_keywords:{
      type:'string'
    },
  	body:{
  		type:'text',
  		required: true,
  	},
  	isPublished:{
  		type:'boolean',
  		defaultsTo: false
  	},
    image:{
    	type:'url',
    },	  	
    author:{
  		model: 'User',
  		required: true,
  	},
    theme:{
      model: 'Theme',
      required: true,
    },
    views: {
      collection:'ReadedArticle',
      via:'article'
    },
	//tags
	//drafts
  }
};

