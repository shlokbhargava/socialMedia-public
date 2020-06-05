const express = require('express');
const env = require('./config/environment');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
// for authentication
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
// google oauth
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
// use flash message
const flash = require('connect-flash');
// Custom Middleware
const customMware = require('./config/middleware');
// Set up the Chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path = require('path');


app.use(sassMiddleware({
    src: path.join(__dirname, env.asset_path, '/scss'),
    dest: path.join(__dirname, env.asset_path, '/css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static(env.asset_path));

// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// extract styles and scripts from sub pages into layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(expressLayouts);  // before routes as views will be used in it to render


// set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');


// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },

    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled',

        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes/index'));


app.listen(port, function(err){
    if (err){
        // Interpolation 
        console.log(`Error in running the server: ${err}`);   
        return;
    }

    console.log(`The server is running on port: ${port}`);
});