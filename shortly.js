var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var session = require('express-session');

var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session({secret:'lalalalla'}));

var checkUser = function(req,res,next){
  req.session.user ? next() : res.redirect('/login');
  // if (req.session.user) { //if log in session exists, go to ind
  //   next();
  // } else { //else go to /login page
  //   res.redirect('login');
  // }
};
app.get('/',checkUser,
function(req, res) {
  res.render('index');
});

app.get('/create',checkUser,
function(req, res) {
  res.render('index');
});

app.get('/links',checkUser,
function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.send(200, links.models);
  });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/
app.get('/login',
function(req, res) {
  res.render('login');
});

app.get('/signup',
function(req, res) {
  res.render('signup');
  // do some authentication probably
});

//this code should execute after logging in
app.post('/login', function(request, response) {

    var username = request.body.username;
    var password = request.body.password;

    console.log("inputted username: ", username);
    console.log("inputted password: ", password);

    db.knex('users').select('username')
      .where('username', username)
      .andWhere('password', password)
    .then( function (names) {
      console.log("database found username/pw");
      request.session.regenerate(function(){
        console.log("login successful, what is names?:", names);
        if (names[0]) {
          console.log("names[0] matches username");
          request.session.user = username;
          response.redirect('/');
        } else {
          console.log("invalid user");
          response.redirect('/login');
          // throw new Error('invalid user');
        }
      })
    });
    // .catch(function(error) {
    //   console.log("login failed: ", error );
    //   response.redirect('/login');
    // });

});

app.post('/signup', function(request, response) {

    var user = request.body.username;
    var pass = request.body.password;

    console.log('username = ', user);
    console.log('password = ', pass);

    db.knex('users').insert({password:pass, username:user})
    .then( function (names) {
      request.session.regenerate(function(){
        request.session.user = user;
        console.log("signup succe", names)
        response.redirect('/');
      })
    })
    .catch(function(error) {
      console.log("error at signup");
      response.redirect('signup');
    })
});


app.get('/logout', function(request, response){
  console.log('logout clicked');
  request.session.destroy(function(err){
    console.log('session destroyed:', err);
    response.render('logout');
  });
});

app.post('/links',
function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save().then(function(newLink) {
          Links.add(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
});




/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        link_id: link.get('id')
      });

      click.save().then(function() {
        db.knex('urls')
          .where('code', '=', link.get('code'))
          .update({
            visits: link.get('visits') + 1,
          }).then(function() {
            return res.redirect(link.get('url'));
          });
      });
    }
  });
});

console.log('Shortly is listening on 4568');
app.listen(4568);
