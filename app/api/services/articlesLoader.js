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

var popularArticles = [];
var popularUpdated = null;

exports.getPopular = function(){
	var deferred = Q.defer();

	var now = new Date();
	var delta = 99999;
	if(popularUpdated){
		//Hours from last update
		delta = (now - popularUpdated)/(1000*60*60);
	}

	if( (delta > 6) || !popularUpdated || (popularArticles.length < 1)){
		//two month ago
		var dateAgo = new Date(now.setDate(now.getDate() - 60));
		ReadedArticle.find({
			createdAt: {'>=': dateAgo}
		})
		.exec(function(err, readData){
			if(err){
				deferred.reject(new Error(err));
				return;
			}
			var aggregatedData = [];
			for (var i = readData.length - 1; i >= 0; i--) {
				if(!aggregatedData[readData[i].article]){
					aggregatedData[readData[i].article] = {val : 0, article: readData[i].article};
				}
				aggregatedData[readData[i].article].val += 1;
			}
			var resultArr = aggregatedData.sort(function(a,b){
				return b.val - a.val;
			})
			.filter(function(a){
				return !!a;
			})
			.slice(0,5)
			.map(function(a){
				return a.article;
			});
			Article.find({id : resultArr, isPublished: true})
			.populate('theme')
			.populate('author')
			.exec(function(err, data){
				if(err){
					deferred.reject(new Error(err));
					return;
				}
				popularUpdated = new Date();
				popularArticles = data;
				deferred.resolve(popularArticles);
			});

		});
	}else{
		deferred.resolve(popularArticles);
	}
	return deferred.promise;
}