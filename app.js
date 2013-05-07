/**
 * Developer notes
 *
 * When you create your app at Twitter you have to provide a callback URL that can be anything,
 * for example I set mine to be:  http://127.0.0.1/anything because in the TwitterStrategy
 * we specified a callback url.  It appears if you do not put something in the Twitter app registration
 * then you cannot override it.  Very obvious!
 *
 * These have to be the last app.use statements:
 * app.use(app.router)
 * app.user(express.static(path.join(__dirname, 'public')));
 *
 * you have to use 127.0.0.1:3000 to access the application, localhost:3000 wont do it.
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , photos = require('./routes/photos')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , connectEnsureLogin = require('connect-ensure-login')
  , TwitterStrategy = require('passport-twitter').Strategy
  , LocalStrategy = require('passport-local').Strategy
  , keyModel = require('./models/appkeys');

var os = require('os');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('secret'));
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/photos', connectEnsureLogin.ensureLoggedIn('/login'), function(req,res) {
    photos.list(req,res);
});

//app.get('/', routes.index);
app.get('/', connectEnsureLogin.ensureLoggedIn('/login'), function(req,res) {
    res.send('Hello ' + req.user.username);
});
app.get('/users', user.list);
app.get('/account', connectEnsureLogin.ensureLoggedIn('/login'), function(req,res) {
    res.send('Hello ' + req.user.username);
});
app.get('/login', function( req, res ) {
    res.send('<html><body><a href="/auth/twitter">Sign in with Twitter</a></body></html>');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));

/*
passport.use(new LocalStrategy(
        function(username, password, done) {
            if (err) { return done(err); }

            if( username == "foo" || password == "bar") {
              return done(null, {username: "foo", firstname: "bob", lastname: "builder"});
            } else {
              return done(null, false, { message: 'Incorrect login' });
            }
        }
));
*/

// host ip address
var hostIpAddress = "";
var ifaces=os.networkInterfaces();
for (var dev in ifaces) {
    var alias=0;
    ifaces[dev].forEach(function(details){
        if (details.family=='IPv4') {
            hostIpAddress = details.address
            console.log(dev+(alias?':'+alias:''),details.address);
            ++alias;
        }
    });
}


passport.use(new TwitterStrategy({
            consumerKey: keyModel.getKey(),
            consumerSecret: keyModel.getSecret(),
            callbackURL: "http://" + hostIpAddress + ":3000/auth/twitter/callback"
        },
        function(token, tokenSecret, profile, done) {
            // NOTE: You'll probably want to associate the Twitter profile with a
            //       user record in your application's DB.
            var user = profile;
            return done(null, user);
        }
));


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('USE: 127.0.0.1:3000 Express server listening on port ' + app.get('port'));
});
