NodeAuthTest
============

Test Application using Node.js, Passport and Twitter Authentication

Using this blog post as an example, I filled in some of the missing details and finally got it work
http://blog.nodeknockout.com/post/34765538605/getting-started-with-passport

See app.js

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

