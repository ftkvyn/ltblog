/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#!/documentation/concepts/ORM
 */

module.exports.models = {

  connection: 'mysqlServer',
  schema:true,
  migrate:'alter',
//   migrate:'safe',
  /***************************************************************************
  *                                                                          *
  * Your app's default connection. i.e. the name of one of your app's        *
  * connections (see `config/connections.js`)                                *
  *                                                                          *
  ***************************************************************************/
  // connection: 'localDiskDb',

  /***************************************************************************
  *                                                                          *
  * How and whether Sails will attempt to automatically rebuild the          *
  * tables/collections/etc. in your schema.                                  *
  *                                                                          *
  * See http://sailsjs.org/#!/documentation/concepts/ORM/model-settings.html  *
  *                                                                          *
  ***************************************************************************/
  // migrate: 'alter'

  attributes:{
    createdAtStr:function (locale) {
      if(!locale){
        return this.createdAt.toLocaleDateString();
      }
      if(locale == 'en'){
        return `${this.createdAt.getDate()}/${this.createdAt.getMonth() + 1}/${this.createdAt.getFullYear()}`;
      }
      if(locale == 'ru'){
        return `${this.createdAt.getDate()}.${this.createdAt.getMonth() + 1}.${this.createdAt.getFullYear()}`;  
      }
      return this.createdAt.toLocaleDateString(); 
    },
  }  
};
