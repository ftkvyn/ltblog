module.exports = function(req, res, next) {

	if(!req.session.user){
		return res.forbidden('You are not permitted to perform this action.');
	}

  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }

  var id = req.body.id;
  if(!id){
  	return next();
  }

  Article.findOne(id)
  .exec(function(err, data){
  		if(err || !data){
  			//not handling errors here.
  			return next();
  		}
  		if(data.author !== req.session.user.id){
  			return res.forbidden('You are not permitted to perform this action.');
  		}
  		return next();
  });
};