module.exports = function(req, res, next) {

  if (req.session.reader) {
    return next();
  }

  Reader.create({}).exec(function(err, data){
  		req.session.reader = data;
		return next();
	});    	
};
