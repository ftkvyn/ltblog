module.exports = function(req, res, next) {

  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }

  return res.forbidden('You are not permitted to perform this action.');
};