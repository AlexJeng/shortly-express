var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var Link = require('./link');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  links: function() {
    return this.hasMany(Link, 'link_id');
  },
  initialize: function(){
    this.on('signing', function(model, attrs, options){
      // var username = attrs.username;
      // var password = attrs.password;
      // save it somehow
    });
  }
});

module.exports = User;
