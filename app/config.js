var Bookshelf = require('bookshelf');
var path = require('path');

var db = Bookshelf.initialize({
  client: 'sqlite3',
  connection: {
    host: '127.0.0.1',
    user: 'your_database_user',
    password: 'password',
    database: 'shortlydb',
    charset: 'utf8',
    filename: path.join(__dirname, '../db/shortly.sqlite')
  }
});

db.knex.schema.hasTable('urls').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('urls', function (link) {
      link.increments('id').primary();
      link.string('url', 255); // LONG ONE
      link.string('base_url', 255);  // SHORT BASE
      link.string('code', 100); // SHORT EXTENSION
      link.string('title', 255);
      link.integer('user_id');
      link.integer('visits');
      link.timestamps();
    }).then(function (table) {
      console.log('Created Urls Table', table);
    });
  }
});

db.knex.schema.hasTable('clicks').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('clicks', function (click) {
      click.increments('id').primary();
      click.integer('link_id');
      click.timestamps();
    }).then(function (table) {
      console.log('Created Clicks Table', table);
    });
  }
});

/************************************************************/
// Add additional schema definitions below
/************************************************************/

// username & password

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('password', 255);
      user.string('username', 255);
      user.integer('link_id');
      user.timestamps();
    }).then(function (table) {
      console.log('Created User Table', table);
    });
  }
});

module.exports = db;
