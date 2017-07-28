var Q = require('q');

exports.loadArticlesPage = function(where, options) {
	var deferred = Q.defer();

	if(!options.pageSize){
		options.pageSize = 10;
	}
	if(!options.page){
		options.page = 1;
	}
	options.skip = options.pageSize * (options.page - 1);
	
	var qs = [];
	qs.push(Article.find({limit: options.pageSize, skip: options.skip, where:where})
		.sort('createdAt DESC')
		.populate('theme')
		.populate('author'));
	qs.push(Article.count({where:where}))
	Q.all(qs)
	.then(function(data){
		var totalPages = Math.ceil(data[1] / options.pageSize);
		deferred.resolve({ articles: data[0], totalPages: totalPages });
	})
	.catch(function (err) {
        deferred.reject(new Error(err));
    })
    .done();	
    return deferred.promise;		
}