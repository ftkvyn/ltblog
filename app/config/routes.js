/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  
  '/': 'ViewsController.home',

  /*'/article/:id': 'ViewsController.article',*/

  '/admin/login': 'AdminViewsController.login',

  '/admin': 'AdminViewsController.main',

  '/admin/users': 'AdminViewsController.users',

  '/api/addUser': 'AdminActionsController.createUser',

  '/api/deleteUser': 'AdminActionsController.deleteUser',

  '/admin/tags': 'AdminViewsController.tags',

  '/admin/articles': 'AdminViewsController.articles',

  '/admin/articles/changeDate': 'AdminActionsController.changeDate',

  '/admin/themes': 'AdminViewsController.themes',

  '/admin/articles/new': 'AdminViewsController.newArticle',

  '/admin/articles/edit/:id': 'AdminViewsController.editArticle',

  '/api/articles/save': 'AdminActionsController.saveArticle',

  '/api/articles/publish': 'AdminActionsController.publishArticle',

  '/api/articles/hide': 'AdminActionsController.hideArticle',

  '/api/login': 'AuthController.login',

  '/logout': 'AuthController.logout',

  '/admin/changePassword': 'AdminViewsController.changePassword',

  '/api/changePasswords': 'AdminActionsController.changePasswords',

  '/api/getUserData/:id': 'AdminActionsController.getUserData',

  '/api/saveUser': 'AdminActionsController.saveUser',

  '/about': 'ViewsController.about',

  '/relates/:id': 'ViewsController.relates',

  '/:theme/:id': 'ViewsController.article',

  '/:theme': 'ViewsController.theme',

  '/:authorUrl': 'ViewsController.author',




  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
